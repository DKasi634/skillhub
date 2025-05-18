import React, { useEffect, useState } from "react";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement,
  useStripe,
  useElements 
} from "@stripe/react-stripe-js";
import { IUser, IBookingRequest, BookingStatus } from "@/api/types";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { sendEmail } from "@/utils";
import { getBookingRequestById, getUserById, processTutoringSessionPayment, updateBookingRequestStatus } from "@/utils/supabase/supabase.utils";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

// Helper function to generate a mock Zoom meeting link.
const generateZoomLink = (transactionId: string): string => {
  return `https://zoom.us/j/ ${transactionId}`;
};

const PaymentForm = () => {
  const [searchParams] = useSearchParams();
  const bookingRequestIdParam = searchParams.get("requestId");
  const tutorIdParam = searchParams.get("tutorId");
  const subjectParam = searchParams.get("subject");
  const amountParam = searchParams.get("amount");
  const defaultAmount = amountParam ? parseFloat(amountParam) : 50;

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [thisTutor, setThisTutor] = useState<IUser | null>(null);
  const [thisRequest, setThisRequest] = useState<IBookingRequest | null>(null);
  const [cardType, setCardType] = useState<string>("default");

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // Card type icons
  const cardIcons: Record<string, string> = {
    visa: "💳 Visa",
    mastercard: "💳 Mastercard",
    amex: "💳 Amex",
    discover: "💳 Discover",
    default: "💳"
  };

  // Fetch tutor and request data
  useEffect(() => {
    if (tutorIdParam && tutorIdParam.trim()) {
      fetchTutor(tutorIdParam);
    }
  }, [tutorIdParam]);

  useEffect(() => {
    if (bookingRequestIdParam) {
      fetchRequest(bookingRequestIdParam);
    } else {
      navigate("/me");
    }
  }, [bookingRequestIdParam]);

  useEffect(() => {
    if (thisRequest && thisRequest.status === BookingStatus.SCHEDULED) {
      navigate("/me");
    }
  }, [thisRequest]);

  const fetchRequest = async (requestId: string) => {
    try {
      const bookingRequest = await getBookingRequestById(requestId);
      if (bookingRequest) setThisRequest(bookingRequest);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  const fetchTutor = async (tutorId: string) => {
    try {
      const fetchedTutor = await getUserById(tutorId);
      if (fetchedTutor) setThisTutor(fetchedTutor);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    }
  };

  const handleCardNumberChange = (event: any) => {
    if (event.brand) {
      setCardType(event.brand in cardIcons ? event.brand : "default");
    }
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!currentUser || !currentUser.user || !bookingRequestIdParam || !tutorIdParam || !subjectParam || !thisTutor) return;
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const expiry = elements.getElement(CardExpiryElement);
    const cvc = elements.getElement(CardCvcElement);

    if (!cardNumber || !expiry || !cvc) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

    

      const responseData = await res.json();
      const {paymentIntent} = responseData
    //   console.log("\n\nReturned payment response as : ", responseData)

      if (!paymentIntent?.client_secret) {
        throw new Error("Failed to create payment intent.");
      }

      const { error: paymentError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name: currentUser.user.email || "Guest",
            },
          },
        }
      );

      if (paymentError) throw paymentError;

      if (confirmedIntent?.status === "succeeded") {
        const transactionId = confirmedIntent.id;
        const zoomLink = generateZoomLink(transactionId);

        const result = await processTutoringSessionPayment(
          tutorIdParam,
          currentUser.user.id,
          subjectParam,
          amount,
          transactionId,
          zoomLink
        );

        if (!result || !result.session || !result.payment) {
          throw new Error("Failed to create session and payment records.");
        }

        const emailsSent = await sendEmail(thisTutor.email, currentUser.user.email, subjectParam, zoomLink);
        if (!emailsSent) throw new Error("Could not send emails!");

        const updatedRequest = await updateBookingRequestStatus(bookingRequestIdParam, BookingStatus.SCHEDULED);
        setTimeout(() => {
          setThisRequest(updatedRequest);
        }, 3000);

        setSuccessMessage("Payment successful! Your tutoring session is now scheduled.");
      } else {
        throw new Error("Payment not successful.");
      }
    } catch (err: any) {
      console.error("Payment processing error:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-gray-50 py-8 px-4">
      <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handlePayment}>
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
        
        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Session Fee ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            min="0.01"
            step="0.01"
          />
        </div>

        {/* Subject Display */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Subject:</span> {subjectParam}
          </p>
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <div className="relative">
            <div className="border rounded p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
                onChange={handleCardNumberChange}
              />
            </div>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {cardIcons[cardType] || cardIcons.default}
            </span>
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiration</label>
            <div className="border rounded p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <div className="border rounded p-3 focus-within:ring-2 focus-within:ring-blue-500">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

        <BaseButton
          className={`${isLoading ? "cursor-not-allowed opacity-90" : ""}`}
          submitType="submit"
          type={buttonType.blue}
          disabled={isLoading || !stripe}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </BaseButton>
      </form>
      {isLoading && <AbsoluteLoaderLayout />}
    </div>
  );
};

export default PaymentForm;