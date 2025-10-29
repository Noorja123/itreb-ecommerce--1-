import Link from "next/link"

export default function Hero() {
  return (
    <section
      className="flex-1 text-black py-20 px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url(/hero-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/10"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-black">Welcome to ITREB India</h1>
        <p className="text-lg md:text-xl mb-8 text-balance opacity-95 text-black">
          Discover our premium products and services
        </p>
        <Link href="/products" className="btn-primary inline-block">
          Shop Now
        </Link>
      </div>
    </section>
  )
}
