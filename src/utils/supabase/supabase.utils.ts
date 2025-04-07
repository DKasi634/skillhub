import { BookingStatus, SessionStatus, IPayment, IProfile, ITutoringSession, IUser, PaymentStatus, UserRole } from "@/api/types";
import { supabase } from "./supabase.config";

import { IBookingRequest } from "@/api/types";
import { getNewUUID } from "..";

const SUPABASE_BUCKET_NAME = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

// Upload an image
export const uploadToSupabaseStorage = async (
  file: File,
  folderPath: string
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .upload(`${folderPath || "Generic"}/Image_${Date.now()}`, file);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  const publicUrl = supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .getPublicUrl(data.path).data.publicUrl;
  return publicUrl;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user by ID:", error.message);
    return null;
  }

  return data as IUser;
};


export const getProfileByUserId = async (
  userId: string
): Promise<IProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      return null;
    }
    return data as IProfile;
  } catch (error) {
 // console.log("Something went wrong when getting the profile !");
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1)
      .single(); // Use .single() to get a single object

    if (error) {
      // console.error("Error in getUserByEmail:", error);
      return null;
    }
    return data as IUser; // Return the user if found
  } catch (error) {
    console.error("Unexpected error in getUserByEmail:", error);
    return null;
  }
};


export const createOrUpdateProfile = async (
  userId: string,
  profile: IProfile
): Promise<IProfile | null> => {
  if (!userId) {
    return null;
  }
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        [profile],
        { onConflict: "user_id" } // Use 'user_id' as the conflict resolution key
      )
      .select("*")
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }
 // console.log("\nUpdated profile : ", profileData)
    return profileData as IProfile;
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    return null;
  }
};

export const createOrUpdateUser = async (
  user: IUser
): Promise<IUser | null> => {
  if (!user.email) {
    console.error("Missing required fields.");
    return null;
  }

  try {
    // Use upsert with conflict resolution on email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert([{ ...user }], {
        onConflict: "email", // Resolve conflicts using the email field
        ignoreDuplicates: false, // Allow updates on conflict
      })
      .select()
      .single();

    if (userError) {
      console.error("Error creating/updating user:", userError);
      return null;
    }
    return userData as IUser;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};



/**
 * Create a new booking request.
 *
 * @param request - The request object to create.
 * @returns The created booking request or an error.
 */
export const createBookingRequest = async (
  request:IBookingRequest
): Promise<IBookingRequest|null> => {
  const { data, error } = await supabase
    .from("booking_requests")
    .insert([{...request}]).select()
    .single();
  if(error){
 // console.log(error)
    return null
  }
  return data as IBookingRequest
};

/**
 * Fetch a booking request based on that request's Id.
 *
 * @param requestId - The requestId's ID.
 * @returns The fetched booking request or an error.
 */
export const getBookingRequestById = async (
  requestId:string
): Promise<IBookingRequest|null> => {
  const { data, error } = await supabase
    .from("booking_requests").select().eq("id", requestId)
    .single();
  if(error){
    return null
  }
  return data as IBookingRequest
};

/**
 * Get all booking requests for a specific tutor.
 *
 * @param tutorId - The tutor's ID.
 * @returns A list of booking requests for the tutor.
 */
export const getBookingRequestsForTutor = async (
  tutorId: string
): Promise<IBookingRequest[]|null> => {
  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });
    if(error){
      return null
    }
  return data as IBookingRequest[];
};

/**
 * Get all booking requests for a specific student.
 *
 * @param studentId - The student's ID.
 * @returns A list of booking requests made by the student.
 */
export const getBookingRequestsForStudent = async (
  studentId: string
): Promise<IBookingRequest[]|null> => {
  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if(error){ return null }
  return data as IBookingRequest[]
};

/**
 * Update the status of a booking request.
 *
 * @param requestId - The booking request's ID.
 * @param status - New status ('pending', 'accepted', or 'rejected').
 * @returns The updated booking request or an error.
 */
export const updateBookingRequestStatus = async (
  requestId: string,
  status: BookingStatus
): Promise<IBookingRequest|null> => {
  const { data, error } = await supabase
    .from("booking_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId).select()
    .single();
  if(error){ 
    // console.log("\nError updating : ", error)
    return null }
  return data as IBookingRequest;
};


/**
 * Update a tutor's subjects.
 *
 * @param userId - The tutor's user ID.
 * @param subjects - The list of subjects to set.
 * @returns The updated profile or null if an error occurred.
 */
export const updateTutorSubjects = async (userId: string, subjects: string[]): Promise<IProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ subjects })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) {
    console.error("Error updating tutor subjects:", error);
    return null;
  }
  return data as IProfile;
};


/**
 * Extend IProfile to include the tutor's user information.
 */
export interface ITeacherProfile extends IProfile {
  user: IUser;
}


/**
 * Fetch teacher profiles from Supabase.
 * This function selects from the "profiles" table and joins with the "users" table,
 * filtering for those where the user's role is "TUTOR".
 */
export const getTeachers = async (): Promise<ITeacherProfile[] | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*, user:users(id, role, email)`)
    .eq("user.role", UserRole.TUTOR);
    
  if (error) {
    console.error("Error fetching teachers:", error);
    return null;
  }

  return (data as ITeacherProfile[]).filter(profile => profile.user);
};


/**
 * Fetch teacher profiles from Supabase that have the given subject.
 * Assumes the "subjects" column is stored as an array.
 *
 * @param subject - The subject to search for.
 * @returns A list of teacher profiles matching the subject, or null on error.
 */
export const getTeachersBySubject = async (subject: string): Promise<ITeacherProfile[] | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*, user:users(id, role, email)`)
    .eq("user.role", UserRole.TUTOR)
    .contains("subjects", [(String(subject).charAt(0).toUpperCase()+ String(subject).slice(1))]);
    
  if (error) {
    console.error("Error fetching teachers by subject:", error);
    return null;
  }
  return data as ITeacherProfile[];
};

/**
 * Fetch teacher profiles from Supabase that have a name matching the search query.
 *
 * @param name - The tutor name to search for.
 * @returns A list of teacher profiles whose name matches, or null on error.
 */
export const getTeachersByName = async (name: string): Promise<ITeacherProfile[] | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*, user:users(id, role, email)`)
    .eq("user.role", UserRole.TUTOR)
    .ilike("name", `%${name.toLocaleLowerCase()}%`);
    
  if (error) {
    console.error("Error fetching teachers by name:", error);
    return null;
  }
  return data as ITeacherProfile[];
};


/**
 * Inserts a IPayment record into Supabase.
 */
export const createPayment = async (
  payment:IPayment
): Promise<IPayment | null> => {
  const { data, error } = await supabase
    .from("payments")
    .insert([ payment])
    .select()
    .single();
  if (error) {
    console.error("Error creating payment record:", error);
    return null;
  }
  return data as IPayment;
};

/**
 * Inserts a Tutoring Session record into Supabase.
 */
export const createTutoringSession = async (
  tutoring_session:ITutoringSession,
): Promise<ITutoringSession | null> => {
  const { data, error } = await supabase
    .from("tutoring_sessions")
    .insert([
      tutoring_session
    ])
    .select()
    .single();
  if (error) {
    console.error("Error creating tutoring session:", error);
    return null;
  }
  return data as ITutoringSession;
};


/**
 * Processes a tutoring session payment after receiving a successful PaymentIntent from Stripe.
 * 
 * @param tutor_id - The tutor's user ID.
 * @param student_id - The student's user ID.
 * @param subject - The subject of the tutoring session.
 * @param amount - The session fee (in dollars).
 * @param transaction_id - The Stripe PaymentIntent ID.
 * @param session_link - (Optional) The link to the session (e.g., Zoom URL).
 * @returns An object containing the created tutoring session and payment records, or null on error.
 */
export const processTutoringSessionPayment = async (
  tutor_id: string,
  student_id: string,
  subject: string,
  amount: number,
  transaction_id: string,
  session_link?: string,
): Promise<{ session: ITutoringSession | null; payment: IPayment | null } | null> => {
  const dateNow = new Date();
  // Prepare the new Payment record
  const newPayment: IPayment = {
    id: getNewUUID(),
    transaction_id,
    amount,
    payment_status: PaymentStatus.COMPLETED,
    created_at: dateNow,
    student_id,
    tutor_id,
  };
  
  // Create Payment record in Supabase
  const payment = await createPayment(newPayment);
  if (!payment) return null;

  // Prepare the new Tutoring Session record
  const newTutoringSession: ITutoringSession = {
    id: getNewUUID(),
    tutor_id,
    student_id,
    subject,
    payment_id: payment.id,
    session_link,
    status: SessionStatus.SCHEDULED,
    created_at: dateNow,
    updated_at: dateNow,
  };
  
  // Create Tutoring Session record in Supabase
  const session = await createTutoringSession(newTutoringSession);
  if (!session) return null;
  
  return { session, payment };
};