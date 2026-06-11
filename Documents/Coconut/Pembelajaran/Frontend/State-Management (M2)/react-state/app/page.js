import Image from "next/image";
import Hero from "./components/hero";

export default function Home() {
  return (
    <div>
      <h1 className="text-center font-bold text-primary mt-8 text-3xl">STATE-MANAGEMENT</h1>
      <Hero />
    </div>
  );
}
