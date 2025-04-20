"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Menu,
  X,
  LineChart,
  Share2,
  Layers,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <div className="h-[36px] w-[36px] rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart3 className="h-[22px] w-[22px] text-white" />
            </div>
            <span className="text-lg font-bold text-blue-600">E-Kinerja</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Manfaat
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Kontak
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full px-4">
                Masuk
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Menu</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="container flex flex-col space-y-3 py-4 px-4">
              <Link
                href="#"
                className="py-2 text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="#"
                className="py-2 text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fitur
              </Link>
              <Link
                href="#"
                className="py-2 text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Manfaat
              </Link>
              <Link
                href="#"
                className="py-2 text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href="#"
                className="py-2 text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Masuk
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Kelola Perencanaan Strategis Seperti Ahli
              </h1>
              <p className="text-md text-gray-600 max-w-[540px]">
                E-Kinerja membantu Anda menyusun dan mengelola rencana strategis
                dengan mudah dan efisien, sehingga Anda dapat fokus pada
                pencapaian target.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full px-6"
                >
                  Mulai Sekarang
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[550px]"
            >
              <div className="bg-gray-100 rounded-3xl p-6 relative">
                <div className="flex justify-center items-center h-full">
                  <Image
                    src="/images/home.jpg"
                    alt="Dashboard E-Kinerja"
                    width={400}
                    height={300}
                    className="mx-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trusted By */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-gray-500 mb-6">Dipercaya oleh</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70">
              <Image src="/placeholder.svg" alt="Logo 1" width={80} height={30} />
              <Image src="/placeholder.svg" alt="Logo 2" width={80} height={30} />
              <Image src="/placeholder.svg" alt="Logo 3" width={80} height={30} />
              <Image src="/placeholder.svg" alt="Logo 4" width={80} height={30} />
              <Image src="/placeholder.svg" alt="Logo 5" width={80} height={30} />
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-blue-600 font-medium mb-2 uppercase text-sm tracking-wider">
              KEUNGGULAN KAMI
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Untuk Organisasi Anda
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Kami telah mengembangkan solusi perencanaan strategis terbaik
              untuk membantu organisasi Anda mencapai tujuan dengan lebih
              efektif dan efisien.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Integrasi Terpadu
                </h3>
                <p className="text-gray-600">
                  Hubungkan semua data dan sistem Anda untuk mendapatkan
                  gambaran lengkap tentang perencanaan strategis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <LineChart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Analisis Tren
                </h3>
                <p className="text-gray-600">
                  Dapatkan wawasan tentang tren kinerja untuk membuat keputusan
                  yang lebih baik dan strategis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Mode Kolaborasi
                </h3>
                <p className="text-gray-600">
                  Bekerja sama dengan tim Anda secara real-time untuk menyusun
                  dan mengelola rencana strategis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Mode Otomatis
                </h3>
                <p className="text-gray-600">
                  Otomatiskan proses pelaporan dan pemantauan untuk menghemat
                  waktu dan mengurangi kesalahan.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Sistem Terintegrasi
                </h3>
                <p className="text-gray-600">
                  Integrasikan semua proses perencanaan strategis dalam satu
                  platform yang mudah digunakan.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Multi-Organisasi
                </h3>
                <p className="text-gray-600">
                  Kelola beberapa unit organisasi dalam satu platform dengan
                  kemudahan akses dan kontrol.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/dashboard.png"
                  alt="E-Kinerja in action"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4 shadow-lg">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-blue-600 font-medium uppercase text-sm tracking-wider">
                LIHAT LEBIH BANYAK
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Tingkatkan Produktivitas
              </h2>
              <p className="text-gray-600">
                E-Kinerja membantu Anda mengoptimalkan proses perencanaan
                strategis, sehingga Anda dapat fokus pada hal-hal yang
                benar-benar penting bagi organisasi Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Alamat email Anda"
                  className="rounded-full px-4 py-2 border-gray-300"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                  Mulai Sekarang
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-[36px] w-[36px] rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart3 className="h-[22px] w-[22px] text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">E-Kinerja</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} E-Kinerja. Hak Cipta Dilindungi.
            </div>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
