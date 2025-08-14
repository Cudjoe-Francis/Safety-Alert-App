export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface UserDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  bloodType: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  occupation: string;
  gender: string;
  medicalCondition: string;
  allergies: string;
}

export interface AlertData {
  userId: string;
  userName: string;
  serviceType: string;
  time: any;
  location: string;
  lat: number;
  lng: number;
  message: string;
  user: UserDetails;
  emergencyContacts: EmergencyContact[];
}

export function buildAlertData(
  user: UserDetails,
  emergencyContacts: EmergencyContact[],
  location: { lat: number; lng: number; address: string },
  serviceType: string,
  userId: string
): AlertData {
  const userName = `${user.firstName} ${
    user.middleName ? user.middleName + " " : ""
  }${user.lastName}`;
  const message = `This is ${userName} at ${location.address} and I'm in danger. Kindly help me.`;

  return {
    userId,
    userName,
    serviceType,
    time: new Date(),
    location: location.address,
    lat: location.lat,
    lng: location.lng,
    message,
    user,
    emergencyContacts,
  };
}
