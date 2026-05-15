// src/data/hospitalData.js

export const HOSPITAL = {
    name: "Ratnadeep Multi-Speciality Hospital",
    tagline: "Healing with Compassion · Excellence in Care",
    address: "Plot No. 42, MG Road, Shivaji Nagar, Pune – 411005, Maharashtra, India",
    phone: "+91 20 2765 4321",
    emergency: "1800-222-108 (24/7 Toll Free)",
    email: "info@ratnadeephospital.com",
    established: 1992,
    beds: 450,
    history: [
      "Founded in 1992 by Dr. Arvind Ratnadeep, Ratnadeep Multi-Speciality Hospital began as a modest 40-bed facility in the heart of Pune with a singular mission — to make world-class healthcare accessible to every citizen. Over three decades, it has grown into one of Maharashtra's most trusted hospitals, now spanning 450 beds across three towers.",
      "The hospital pioneered minimally invasive cardiac surgery in the region in 2001, performed Pune's first successful liver transplant in 2008, and established Maharashtra's first dedicated Proton Therapy centre in 2019. Today, more than 1,800 specialists, nurses and support staff work around the clock to serve over 2,00,000 patients annually.",
      "Accredited by NABH and ISO 9001:2015, Ratnadeep continues to invest in cutting-edge technology while preserving the human warmth that has defined the institution since its very first day.",
    ],
    records: [
      { label: "Years of Service", value: "32+" },
      { label: "Annual Patients",  value: "2,00,000+" },
      { label: "Expert Doctors",   value: "1,800+" },
      { label: "Surgeries Done",   value: "50,000+" },
      { label: "Accreditations",   value: "NABH · ISO" },
      { label: "Awards Won",       value: "45+" },
    ],
  };
  
  export const OPD_HOURS = [
    {
      day: "Monday – Friday",
      general: "8:00 AM – 8:00 PM",
      specialist: "9:00 AM – 5:00 PM",
    },
    {
      day: "Saturday",
      general: "8:00 AM – 5:00 PM",
      specialist: "9:00 AM – 1:00 PM",
    },
    {
      day: "Sunday & Public Holidays",
      general: "9:00 AM – 1:00 PM",
      specialist: "By prior appointment only",
    },
  ];