export enum UserRole {
    LEARNER = 'LEARNER',
    TUTOR = 'TUTOR',
    ADMIN = 'ADMIN',
  }
  
  export enum SkillLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
  }
  
  export enum ClassStatus {
    SCHEDULED = 'SCHEDULED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
  }
  export enum BookingStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
  }
  
  export interface IUser {
    id: string;
    role: UserRole;
    email: string;
  }
  
  export type IProfile = {
    id:string,
    user_id: string;
    name: string;
    bio?: string;
    subjects: string[];
    rate_per_hour?: number; // Only for tutors
    skill_level?: SkillLevel; // Only for learners
    profile_image_url?: string;
    created_at: Date;
    updated_at: Date;
  }

  export type IBookingRequest = {
    id: string;
    tutor_id: string;
    student_id: string;
    requested_time: string; // ISO 8601 date string
    message?: string;
    status: BookingStatus,
    created_at: string;
    updated_at: string;
    subject:string
  }
  
  
  export interface Class {
    id: string;
    tutorId: string;
    title: string;
    description?: string;
    subjects: string[];
    schedule: Record<string, string[]>; // Example: { monday: ["10:00-12:00"], wednesday: ["14:00-16:00"] }
    price: number;
    max_participants?: number;
    status: ClassStatus;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ClassParticipant {
    id: string;
    class_id: string;
    learner_id: string;
    joined_at: string;
  }
  
  export interface Payment {
    id: string;
    class_id: string;
    learner_id: string;
    amount: number;
    currency: string;
    payment_status: PaymentStatus;
    transaction_id?: string;
    created_at: Date;
  }
  
  