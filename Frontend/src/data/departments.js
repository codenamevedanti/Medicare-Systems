// src/data/departments.js

export const DEPARTMENTS = [
    {
      id: "cardiology",
      name: "Cardiology",
      icon: "🫀",
      color: "#dc2626",
      tagline: "Heart Care Excellence",
      about:
        "Our Department of Cardiology offers comprehensive cardiac care from preventive screenings to complex interventional procedures. Equipped with state-of-the-art catheterisation labs and a dedicated Cardiac ICU, we handle everything from coronary artery disease to congenital heart defects.",
      doctors: [
        {
          name: "Dr. Suresh Mehta",
          designation: "HOD & Senior Interventional Cardiologist",
          qualification: "MD, DM (Cardiology), FACC",
          visiting: "Mon–Fri: 10:00 AM – 1:00 PM",
          initials: "SM",
        },
        {
          name: "Dr. Priya Kulkarni",
          designation: "Cardiothoracic Surgeon",
          qualification: "MS, MCh (CTVS)",
          visiting: "Tue & Thu: 11:00 AM – 2:00 PM",
          initials: "PK",
        },
        {
          name: "Dr. Rahul Joshi",
          designation: "Electrophysiologist",
          qualification: "MD, DM (Cardiology)",
          visiting: "Mon, Wed, Fri: 9:00 AM – 12:00 PM",
          initials: "RJ",
        },
      ],
    },
    {
      id: "neurology",
      name: "Neurology",
      icon: "🧠",
      color: "#7c3aed",
      tagline: "Advanced Neuro Sciences",
      about:
        "The Neurology and Neurosurgery Department is a Centre of Excellence for stroke, epilepsy, movement disorders, spine surgery and brain tumours. Our 24/7 Stroke Response Team achieves door-to-needle times under 30 minutes.",
      doctors: [
        {
          name: "Dr. Anita Sharma",
          designation: "HOD & Senior Neurologist",
          qualification: "MBBS, MD (Neurology), DM",
          visiting: "Mon–Sat: 9:00 AM – 12:00 PM",
          initials: "AS",
        },
        {
          name: "Dr. Vikram Patel",
          designation: "Neurosurgeon",
          qualification: "MS, MCh (Neurosurgery)",
          visiting: "Tue & Fri: 10:00 AM – 1:00 PM",
          initials: "VP",
        },
        {
          name: "Dr. Sneha Deshpande",
          designation: "Neuro-Rehabilitation Specialist",
          qualification: "MBBS, MD (PMR)",
          visiting: "Wed & Thu: 2:00 PM – 5:00 PM",
          initials: "SD",
        },
      ],
    },
    {
      id: "oncology",
      name: "Oncology",
      icon: "🎗️",
      color: "#059669",
      tagline: "Comprehensive Cancer Care",
      about:
        "Ratnadeep Cancer Institute combines medical oncology, surgical oncology, radiation therapy and palliative care under one roof. Our tumour board meets weekly to plan personalised treatments using the latest evidence-based protocols.",
      doctors: [
        {
          name: "Dr. Kavitha Rao",
          designation: "HOD & Medical Oncologist",
          qualification: "MBBS, MD, DM (Oncology)",
          visiting: "Mon, Wed, Fri: 10:00 AM – 1:00 PM",
          initials: "KR",
        },
        {
          name: "Dr. Nitin Bhosale",
          designation: "Surgical Oncologist",
          qualification: "MS, MCh (Surgical Oncology)",
          visiting: "Tue & Thu: 9:00 AM – 12:00 PM",
          initials: "NB",
        },
        {
          name: "Dr. Leena Patil",
          designation: "Radiation Oncologist",
          qualification: "MBBS, MD (Radiotherapy)",
          visiting: "Mon–Fri: 2:00 PM – 4:00 PM",
          initials: "LP",
        },
      ],
    },
    {
      id: "gynaecology",
      name: "Gynaecology",
      icon: "🌸",
      color: "#db2777",
      tagline: "Women's Health & Maternity",
      about:
        "Our Obstetrics & Gynaecology department provides holistic women's healthcare — from adolescent health through menopause. The dedicated Labour Suite, LDRP rooms and NICU ensure safe deliveries and newborn care.",
      doctors: [
        {
          name: "Dr. Rekha Nair",
          designation: "HOD & Senior Gynaecologist",
          qualification: "MBBS, MS (OBG), FRCOG",
          visiting: "Mon–Sat: 10:00 AM – 1:00 PM",
          initials: "RN",
        },
        {
          name: "Dr. Deepa Krishnan",
          designation: "Laparoscopic Surgeon & Fertility Specialist",
          qualification: "MS (OBG), Fellowship IVF",
          visiting: "Tue & Fri: 11:00 AM – 2:00 PM",
          initials: "DK",
        },
        {
          name: "Dr. Pooja Deshmukh",
          designation: "Maternal-Fetal Medicine Specialist",
          qualification: "MD, DGO, FMFM",
          visiting: "Mon, Wed: 9:00 AM – 12:00 PM",
          initials: "PD",
        },
      ],
    },
    {
      id: "orthopaedics",
      name: "Orthopaedics",
      icon: "🦴",
      color: "#d97706",
      tagline: "Bone, Joint & Spine Care",
      about:
        "The Department of Orthopaedics and Joint Replacement Surgery specialises in joint replacements, sports injuries, spine disorders and trauma. Our robotic-assisted knee and hip replacement programme delivers faster recovery and better outcomes.",
      doctors: [
        {
          name: "Dr. Ajay Shinde",
          designation: "HOD & Joint Replacement Surgeon",
          qualification: "MS (Ortho), Fellowship Joint Replacement",
          visiting: "Mon–Fri: 9:00 AM – 12:00 PM",
          initials: "AS",
        },
        {
          name: "Dr. Manish Gaikwad",
          designation: "Spine Surgeon",
          qualification: "MS, MCh (Spine Surgery)",
          visiting: "Tue & Thu: 10:00 AM – 1:00 PM",
          initials: "MG",
        },
        {
          name: "Dr. Rohit Wagh",
          designation: "Sports Medicine & Arthroscopy",
          qualification: "MS (Ortho), ISAKOS Fellow",
          visiting: "Mon, Wed, Sat: 4:00 PM – 7:00 PM",
          initials: "RW",
        },
      ],
    },
    {
      id: "paediatrics",
      name: "Paediatrics",
      icon: "🧒",
      color: "#2563eb",
      tagline: "Caring for Every Child",
      about:
        "Our Paediatrics department provides complete childcare from newborn assessment and vaccination to complex paediatric surgeries. The child-friendly environment, play therapy and dedicated nursing team ensure every child feels at ease.",
      doctors: [
        {
          name: "Dr. Sunita Divekar",
          designation: "HOD & Senior Paediatrician",
          qualification: "MBBS, MD (Paediatrics), FIAP",
          visiting: "Mon–Sat: 10:00 AM – 1:00 PM",
          initials: "SD",
        },
        {
          name: "Dr. Arun Kulkarni",
          designation: "Paediatric Surgeon",
          qualification: "MS, MCh (Paediatric Surgery)",
          visiting: "Tue & Thu: 9:00 AM – 12:00 PM",
          initials: "AK",
        },
        {
          name: "Dr. Meera Jain",
          designation: "Neonatologist",
          qualification: "MD (Paediatrics), IAP Neonatology",
          visiting: "Mon–Fri: 8:00 AM – 10:00 AM",
          initials: "MJ",
        },
      ],
    },
  ];