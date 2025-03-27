import React, { useEffect, useState } from "react";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import { getBookingRequestById, getUserById, processTutoringSessionPayment, updateBookingRequestStatus } from "@/utils/supabase/supabase.utils";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendEmail } from "@/utils";
import { BookingStatus, IBookingRequest, IUser } from "@/api/types";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";

// Helper function to generate a mock Zoom meeting link.
const generateZoomLink = (transactionId: string): string => {
  // For the mock, we simply use the transactionId as the meeting number.
  return `https://zoom.us/j/${transactionId}`;
};

const TutoringSessionPaymentPage = () => {
  // Retrieve search params from the URL
  const [searchParams] = useSearchParams();
  const bookingRequestIdParam = searchParams.get("requestId");
  const tutorIdParam = searchParams.get("tutorId");
  const subjectParam = searchParams.get("subject");
  const amountParam = searchParams.get("amount");
  const defaultAmount = amountParam ? parseFloat(amountParam) : 50;

  const [thisTutor, setThisTutor]  =  useState<IUser|null>(null);
  const [thisRequest, setThisRequest] = useState<IBookingRequest|null>(null);

  const [amount, setAmount] = useState<number>(defaultAmount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(()=>{
    if(tutorIdParam && tutorIdParam.trim()){
      fetchTutor(tutorIdParam);
    }
  }, [tutorIdParam]);

  useEffect(()=>{
    if(bookingRequestIdParam){
      fetchRequest(bookingRequestIdParam)
    }else{
      navigate("/me")
    }
  }, [bookingRequestIdParam]);

  useEffect(()=>{
    if(thisRequest && thisRequest.status === BookingStatus.SCHEDULED){
      navigate("/me")
    }
  }, [thisRequest])

  const fetchRequest = async (requestId:string) =>{
    try {
      const bookingRequest = await getBookingRequestById(requestId);
      if(bookingRequest){ setThisRequest(bookingRequest)}
    } catch (error) {
      
    }
  }

  const fetchTutor = async (tutorId:string) =>{
    try {
      const fetchedTutor = await getUserById(tutorId);
      if(fetchedTutor){ setThisTutor(fetchedTutor) }
    } catch (error) {
    }
  }



  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
if (!currentUser || !currentUser.user || !bookingRequestIdParam || !tutorIdParam || !subjectParam || !thisTutor) return;
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Step 1: Call Netlify Function to create PaymentIntent
      const res = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const paymentIntent = await res.json();
      if (paymentIntent.error) {
        throw new Error(paymentIntent.error);
      }
      // Use the PaymentIntent.id as the transaction_id
      const transactionId = paymentIntent.id;
      
      // Generate a Zoom meeting link using the transactionId
      const zoomLink = generateZoomLink(transactionId);
      // Process the tutoring session payment in Supabase.
      // currentUser.user.id is the studentId.
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
      if (!emailsSent){
        throw new Error("Could not send emails!")
      }
      const updatedRequest = await updateBookingRequestStatus(bookingRequestIdParam, BookingStatus.SCHEDULED);
      setTimeout(()=>{
        setThisRequest(updatedRequest)
      }, 3000);
      setSuccessMessage("Payment successful! Your tutoring session is now scheduled.");

    } catch (err: any) {
      console.error("Payment processing error:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full min-h-screen relative">
    <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handlePayment}>
      <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Session Fee ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <p>
          <span className="font-semibold">Subject:</span> {subjectParam}
        </p>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
      <BaseButton className={`${isLoading ? "cursor-not-allowed opacity-90":""}`}
        submitType="submit"
        type={buttonType.blue}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </BaseButton>
    </form>
    { isLoading && <AbsoluteLoaderLayout/> }
    </div>
  );
};

export default TutoringSessionPaymentPage;
