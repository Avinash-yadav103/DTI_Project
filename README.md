# CareFolio - Centralized Healthcare Records Management Platform

![CareFolio Banner](https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=2200)
![Screenshot 2025-04-20 211555](https://github.com/user-attachments/assets/842ef935-caaa-4bf5-8239-7acf68e5188e)

## 🩺 Project Overview

**CareFolio** is a comprehensive healthcare records management system designed to centralize medical data access across various stakeholders in the healthcare ecosystem. Similar to **DigiLocker** for government documents, CareFolio provides secure storage, efficient access, and seamless sharing of medical records while maintaining privacy and security.

---

## 🔗 Project Resources

- [YouTube Demo](https://youtu.be/NDuqTRf77OE) - Video walkthrough of the application  
- [Project Report](https://drive.google.com/file/d/1kCZIofTMa9m9_d70Y9XH9tt5p4Abwrq1/view?usp=sharing) - Detailed project documentation  
- [LinkedIn Post](https://www.linkedin.com/posts/avinash-yadav-238785270_healthcareinnovation-smarthealth-aiinhealthcare-activity-7319754434559819776-B1BR?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEJSfwwB-8FgSZGGlryaQhEJ2M5RCYrI8cA) - Project announcement on LinkedIn  
- [Presentation Slides](#) - Project presentation deck  

---

## 📱 Application Screenshots

### Patient Dashboard
![Patient Dashboard](https://github.com/user-attachments/assets/bd35e7fa-c365-4e35-9158-7acf6eef4377)
![Screenshot 2025-05-20 174856](https://github.com/user-attachments/assets/af4d09f8-0b2b-414c-b82c-0fc8fbc5c9cb)
![Screenshot 2025-05-20 174815](https://github.com/user-attachments/assets/5cedd002-d463-4bb8-9a44-46bb35194189)
![Screenshot 2025-05-20 174758](https://github.com/user-attachments/assets/38f55654-ef6a-4060-91c7-c181ebccdbfd)


### Doctor Interface  
![Doctor Interface](https://github.com/user-attachments/assets/5a5257df-4703-493a-8fbf-96ef365bfdc1)
![Screenshot 2025-05-20 174158](https://github.com/user-attachments/assets/8a12a939-d337-4aa8-8ae4-976eeeb85561)
![Screenshot 2025-05-20 174219](https://github.com/user-attachments/assets/f7ed9288-ecca-4c6a-8ee1-127ba658b184)
![Screenshot 2025-05-20 174236](https://github.com/user-attachments/assets/3004e52d-85d2-44eb-97bc-c0df4fec4b92)

### Government Analytics  
![Government Analytics](https://drive.google.com/file/d/10kM2NtGnyL3gkUgHJu5WgN2ODW9t1BU6/view?usp=drive_link)
![Screenshot 2025-05-20 174320](https://github.com/user-attachments/assets/7789db7f-7f5b-4c7c-9bb1-324d4bb254ae)
![Screenshot 2025-05-20 174337](https://github.com/user-attachments/assets/e26c4e0b-7897-4683-8d4a-53366e7e2e38)

### Student/Researcher 
![Screenshot 2025-05-20 174408](https://github.com/user-attachments/assets/2a770df4-e202-4787-a5af-cfc7cea11b26)
![Screenshot 2025-05-20 174424](https://github.com/user-attachments/assets/a3bc5472-0c27-4b02-9e5c-18bf7ffbaa11)
![Screenshot 2025-05-20 174439](https://github.com/user-attachments/assets/3ee72ba0-26e8-4965-9c97-6387543a618e)

---

## 🏥 Key Features

- **Secure Authentication**: Multi-factor authentication with Aadhaar verification  
- **Electronic Health Records**: Comprehensive digital medical records  
- **Access Control**: Patient-controlled sharing of medical data  
- **Appointment Management**: Schedule and manage healthcare appointments  
- **Medication Tracking**: Monitor medication schedules and adherence  
- **Health Analytics**: Track health metrics and receive personalized insights  
- **AI Health Assistant**: Gemini AI powered healthcare advice  
- **Government Oversight**: Anonymized healthcare analytics for policy planning  

---

## 👥 Stakeholders

### 🧑‍⚕️ Patients

- Secure access to complete medical history  
- Control over who can access their medical records  
- Appointment scheduling and reminders  
- Medication tracking and health monitoring  
- AI-powered health advice and recommendations  

### 👨‍⚕️ Healthcare Providers

- Immediate access to patient medical history with consent  
- Comprehensive view of patient health data  
- Efficient appointment management  
- Digital prescription management  
- Secure communication with patients  

### 🎓 Medical Students & Researchers

- Access to anonymized medical data for research  
- Case studies and clinical information for education  
- Understanding healthcare trends and outcomes  
- Training models for predictive healthcare  

### 🏛️ Government Agencies

- Aggregate healthcare analytics  
- Population health monitoring  
- Healthcare infrastructure planning  
- Disease surveillance and epidemic management  
- Healthcare policy development  

---

## 🔄 Data Centralization Model

CareFolio centralizes medical records in a secure, HIPAA-compliant database while allowing patients to maintain control over their data.

- **Patient Ownership**: Patients own their medical data and control access  
- **Interoperability**: Standardized data formats across healthcare providers  
- **Secure Storage**: End-to-end encryption and secure database architecture  
- **Permissioned Access**: Role-based access controls with time-limited permissions  
- **Audit Trails**: Comprehensive logging of all data access events  
- **Regulatory Compliance**: Adherence to healthcare data regulations  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)  
- npm or pnpm  
- MongoDB (for backend storage)  
- Google Cloud account (for Gemini AI integration)  

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/carefolio.git
   cd carefolio
    ```


## 🚀 Getting Started

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

---

### Environment Setup

- Create a `.env.local` file in the **root directory**
- Create a `.env` file in the **backend directory**

---

### Start the Development Servers

#### For the **Next.js frontend**:

```bash
npm run dev
```

#### For the **backend server**:

```bash
cd backend
npm run dev
```

---

### Open Your Browser

The application will be available at:  
[http://localhost:3000](http://localhost:3000)

---

## 🏗️ Deployment

To build for production:

```bash
npm run build
```

---

## 🧠 AI Integration

CareFolio integrates **Google's Gemini 1.5 Flash** model to provide intelligent healthcare advice and insights. The AI carefully avoids making diagnoses or prescribing medication, instead focusing on general health guidance and information.

---

## 🔐 Security Features

- End-to-end encryption  
- Role-based access controls  
- Audit logging  
- Session management  
- Multi-factor authentication  
- HIPAA compliance measures

---

## 📊 Government Dashboard Analytics

The government interface provides powerful analytics tools including:

- Hospital infrastructure analysis  
- Bed capacity monitoring  
- Specialty distribution mapping  
- Healthcare quality metrics  
- Population health trends  
- Disease surveillance

---

## 🛣️ Roadmap

- Mobile application development  
- Integration with wearable health devices  
- Telemedicine video consultation  
- International health record standards compliance  
- Advanced predictive health analytics

---

## 👨‍💻 Contributors

**Avinash Yadav** – Project Lead & Full Stack Developer

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) – The React Framework  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [shadcn/ui](https://ui.shadcn.com/) – UI component library  
- [Google Gemini](https://deepmind.google/technologies/gemini/) – AI model for healthcare insights  
- [Recharts](https://recharts.org/) – Charts library for analytics  
- [Vercel](https://vercel.com/) – Deployment platform  

© 2024 CareFolio Health Technologies
