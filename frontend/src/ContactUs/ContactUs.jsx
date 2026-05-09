import ContactUsForm from "./ContactUsForm"
import FAQ from "./FAQ"

export default function ContactUs() {
  return (
    <div className="w-full flex flex-col">
      <ContactUsForm />
      <FAQ />
    </div>
  );
}