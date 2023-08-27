import Head from "next/head";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <Head>
        <title>Place holder for something, maybe</title>
      </Head>
      <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
            Place holder for something, maybe.
          </h1>

          <div className="relative flex w-full items-center justify-center"></div>
        </div>
      </div>
    </>
  );
}
