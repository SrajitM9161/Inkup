// // app/complete-profile/page.tsx
// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function CompleteProfilePage() {
//   const searchParams = useSearchParams();
//   const missing = searchParams.get("missing")?.split(",") || [];

//   const [formData, setFormData] = useState({
//     businessName: "",
//     phone: "",
//     address: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // 👉 Call API to update profile
//     console.log("Submitting profile data:", formData);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md shadow-lg rounded-2xl">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-center">
//             Complete Your Profile
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {missing.includes("businessName") && (
//               <Input
//                 type="text"
//                 name="businessName"
//                 placeholder="Business Name"
//                 value={formData.businessName}
//                 onChange={handleChange}
//                 required
//               />
//             )}

//             {missing.includes("phone") && (
//               <Input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//               />
//             )}

//             {missing.includes("address") && (
//               <Input
//                 type="text"
//                 name="address"
//                 placeholder="Business Address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//               />
//             )}

//             <Button type="submit" className="w-full">
//               Save & Continue
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
