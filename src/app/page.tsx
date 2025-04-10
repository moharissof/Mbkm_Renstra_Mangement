/* eslint-disable react/no-unescaped-entities */
"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check, X, Star, Download, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

// Animasi variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
}

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
}

const slideRight = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-bold text-xl">e-renstra</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium">
            Beranda
          </Link>
          <Link href="#" className="text-sm font-medium">
            Fitur
          </Link>
          <Link href="#" className="text-sm font-medium">
            Halaman
          </Link>
          <Link href="#" className="text-sm font-medium">
            Harga
          </Link>
          <Link href="#" className="text-sm font-medium">
            FAQ
          </Link>
          <Link href="#" className="text-sm font-medium">
            Kontak
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="#" className="hidden md:block text-sm font-medium">
            Masuk
          </Link>
          <Link href="#" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
            Daftar
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary to-blue-50">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, 10, 0],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute left-1/4 top-1/4 h-8 w-8 rounded-full bg-purple-200"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, -10, 0],
              x: [0, -5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute right-1/4 bottom-1/4 h-6 w-6 rounded-full bg-blue-200"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute left-1/3 bottom-1/3 h-4 w-4 rounded-full bg-purple-200"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, -8, 0],
              x: [0, 8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute right-1/3 top-1/3 h-5 w-5 rounded-full bg-blue-200"
          ></motion.div>
        </div>
        <div className="container mx-auto px-8 md:px-16 lg:px-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Buat Keputusan
                <br />
                Perencanaan Strategis Terbaik
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Sederhanakan proses perencanaan strategis organisasi Anda dengan platform e-renstra yang komprehensif.
                Rencanakan, laksanakan, dan pantau strategi Anda secara efisien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="#" className="bg-primary text-white px-6 py-3 rounded-full font-medium inline-block">
                    Mulai Sekarang
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="border border-gray-300 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    Pelajari Lebih Lanjut <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              className="lg:w-1/2 relative"
            >
              <div className="relative h-[400px] w-[300px] mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="Antarmuka aplikasi e-renstra"
                    width={300}
                    height={600}
                    className="absolute top-0 left-0 rounded-3xl shadow-xl z-20"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="Antarmuka aplikasi e-renstra"
                    width={300}
                    height={600}
                    className="absolute top-10 -left-16 rounded-3xl shadow-xl z-10 opacity-80"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-b">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 mb-6"
          >
            Dipercaya oleh Ratusan Organisasi
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            <motion.div variants={scaleUp}>
              <Image
                src="/placeholder.svg?height=30&width=120"
                alt="Logo klien"
                width={120}
                height={30}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div variants={scaleUp}>
              <Image
                src="/placeholder.svg?height=30&width=120"
                alt="Logo klien"
                width={120}
                height={30}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div variants={scaleUp}>
              <Image
                src="/placeholder.svg?height=30&width=120"
                alt="Logo klien"
                width={120}
                height={30}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div variants={scaleUp}>
              <Image
                src="/placeholder.svg?height=30&width=120"
                alt="Logo klien"
                width={120}
                height={30}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <motion.div variants={scaleUp}>
              <Image
                src="/placeholder.svg?height=30&width=120"
                alt="Logo klien"
                width={120}
                height={30}
                className="opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Buat Organisasi Anda Mengelola
            <br />
            Semuanya Untuk Anda!
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="text-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-purple-100 h-48 rounded-xl mb-6 relative overflow-hidden"
              >
                <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full bg-purple-400"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/placeholder.svg?height=120&width=60"
                    alt="Aplikasi Dashboard"
                    width={60}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Aplikasi Dashboard</h3>
              <p className="text-gray-600">
                Dapatkan tampilan komprehensif tentang kemajuan perencanaan strategis Anda
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center">
              <motion.div whileHover={{ y: -5 }} className="bg-blue-100 h-48 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full bg-blue-400"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/placeholder.svg?height=120&width=60"
                    alt="Buat Akun"
                    width={60}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Buat Akun</h3>
              <p className="text-gray-600">Siapkan profil organisasi Anda dan mulai merencanakan</p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-purple-100 h-48 rounded-xl mb-6 relative overflow-hidden"
              >
                <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full bg-purple-400"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/placeholder.svg?height=120&width=60"
                    alt="Instal Aplikasi"
                    width={60}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Instal Aplikasi & Nikmati</h3>
              <p className="text-gray-600">Akses rencana strategis Anda kapan saja, di mana saja</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideIn}
              className="lg:w-1/2"
            >
              <Image
                src="/placeholder.svg?height=600&width=300"
                alt="Dashboard Analitik"
                width={300}
                height={600}
                className="rounded-3xl shadow-xl mx-auto"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">
                Dashboard Analitik &<br />
                Pelaporan yang Mudah
              </h2>
              <p className="text-gray-600 mb-8">
                Pantau kemajuan perencanaan strategis Anda dengan dashboard analitik yang intuitif. Dapatkan wawasan
                real-time tentang kinerja organisasi Anda.
              </p>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-4"
              >
                <motion.li variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-gray-600">Pelacakan kinerja real-time terhadap tujuan strategis</p>
                </motion.li>
                <motion.li variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-gray-600">Dashboard yang dapat disesuaikan untuk berbagai pemangku kepentingan</p>
                </motion.li>
                <motion.li variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-gray-600">Ekspor laporan dalam berbagai format untuk presentasi</p>
                </motion.li>
              </motion.ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium mt-8"
                >
                  Pelajari Lebih Lanjut <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notification Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <h2 className="text-3xl font-bold mb-6">
                Dapatkan Notifikasi
                <br />
                Aplikasi Prioritas Tertinggi
              </h2>
              <p className="text-gray-600 mb-8">
                Jangan pernah lewatkan pembaruan penting dengan sistem notifikasi cerdas kami. Tetap terinformasi
                tentang tonggak perencanaan strategis Anda.
              </p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-600">Pengingat tugas</p>
                </motion.div>
                <motion.div variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-600">Peringatan tonggak</p>
                </motion.div>
                <motion.div variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-600">Pembaruan kemajuan</p>
                </motion.div>
                <motion.div variants={fadeIn} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-600">Notifikasi tim</p>
                </motion.div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium mt-8"
                >
                  Pelajari Lebih Lanjut <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Orang menggunakan aplikasi e-renstra"
                width={400}
                height={500}
                className="rounded-3xl mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold"
              >
                78rb+
              </motion.p>
              <p className="text-purple-200">Pengguna Aktif</p>
            </motion.div>
            <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold"
              >
                62rb+
              </motion.p>
              <p className="text-purple-200">Rencana Strategis</p>
            </motion.div>
            <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold"
              >
                100rb
              </motion.p>
              <p className="text-purple-200">Unduhan</p>
            </motion.div>
            <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl font-bold"
              >
                59rb+
              </motion.p>
              <p className="text-purple-200">Ulasan Positif</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Aplikasi Paling Intuitif
            <br />
            Untuk Kebutuhan Anda
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-6"
          >
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-purple-100 p-6 rounded-xl"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="Ikon" width={24} height={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Keamanan Perencanaan Strategis</h3>
              <p className="text-gray-600 text-sm">Data strategis Anda dilindungi dengan keamanan tingkat perusahaan</p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-green-100 p-6 rounded-xl"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="Ikon" width={24} height={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Ruang Kerja Kolaboratif</h3>
              <p className="text-gray-600 text-sm">Bekerja bersama dengan tim Anda pada inisiatif strategis</p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-yellow-100 p-6 rounded-xl"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="Ikon" width={24} height={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Pelacakan Tujuan dan Laporan</h3>
              <p className="text-gray-600 text-sm">Pantau kemajuan dan hasilkan laporan komprehensif</p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-red-100 p-6 rounded-xl"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="Ikon" width={24} height={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Optimasi Alokasi Sumber Daya</h3>
              <p className="text-gray-600 text-sm">Alokasikan sumber daya secara efisien untuk inisiatif strategis</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-8">Pertanyaan yang Sering Diajukan</h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-4"
              >
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <h3 className="font-medium">Bagaimana cara membuat rencana strategis di e-renstra?</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Membuat rencana strategis sangat mudah. Setelah masuk, navigasikan ke bagian "Rencana Baru" dan
                    ikuti proses yang dipandu untuk menentukan tujuan, strategi, dan item tindakan Anda.
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <h3 className="font-medium">Bisakah saya berkolaborasi dengan tim saya pada rencana strategis?</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Ya, e-renstra dirancang untuk kolaborasi. Anda dapat mengundang anggota tim, menetapkan tanggung
                    jawab, dan melacak kemajuan bersama secara real-time.
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <h3 className="font-medium">Jenis laporan apa yang dapat saya hasilkan?</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    E-renstra menawarkan berbagai template laporan termasuk laporan kemajuan, ringkasan alokasi sumber
                    daya, pencapaian tonggak, dan analisis komparatif.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              className="lg:w-1/2"
            >
              <div className="bg-primary rounded-3xl p-8 relative">
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center"
                >
                  <X className="h-4 w-4 text-white" />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="Antarmuka aplikasi e-renstra"
                    width={300}
                    height={600}
                    className="rounded-3xl mx-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-4"
          >
            Apa Kata Klien Kami?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          >
            Dengarkan dari organisasi yang telah mengubah proses perencanaan strategis mereka dengan e-renstra.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-gray-600 mb-6">
                &ldquo;E-renstra telah benar-benar mengubah cara kami mendekati perencanaan strategis. Antarmuka yang intuitif
                memudahkan seluruh tim kami untuk berkolaborasi pada inisiatif strategis kami. Fitur pelaporan telah
                menghemat banyak jam kerja manual, dan wawasan yang kami peroleh telah membantu kami membuat keputusan
                yang lebih baik dengan lebih cepat."
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Pengguna"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Pengguna"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Pengguna"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Pengguna"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Pengguna"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <p className="font-medium">Budi Santoso</p>
                  <p className="text-sm text-gray-500">Direktur Perencanaan Strategis</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Pilih Paket yang Sesuai Untuk Anda!
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-full p-1 flex items-center shadow-sm">
              <button className="px-6 py-2 rounded-full bg-primary text-white">Bulanan</button>
              <button className="px-6 py-2 rounded-full text-gray-700">Tahunan</button>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-8 border border-gray-200"
            >
              <h3 className="text-xl font-bold mb-4">Standar</h3>
              <p className="text-4xl font-bold mb-4">Rp200.000</p>
              <p className="text-gray-600 mb-8">Sempurna untuk organisasi kecil</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Hingga 5 pengguna</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Pelaporan dasar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Penyimpanan 1GB</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-gray-300" />
                  <span className="text-sm text-gray-400">Analitik lanjutan</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-gray-300" />
                  <span className="text-sm text-gray-400">Dukungan prioritas</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="block text-center bg-white border border-purple-600 text-purple-600 px-6 py-3 rounded-full font-medium"
                >
                  Pilih Paket
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="bg-primary rounded-xl p-8 border border-purple-600 text-white shadow-xl transform md:-translate-y-4"
            >
              <h3 className="text-xl font-bold mb-4">Profesional</h3>
              <p className="text-4xl font-bold mb-4">Rp1.500.000</p>
              <p className="text-purple-200 mb-8">Sempurna untuk organisasi berkembang</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-white" />
                  <span className="text-sm">Hingga 20 pengguna</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-white" />
                  <span className="text-sm">Pelaporan lanjutan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-white" />
                  <span className="text-sm">Penyimpanan 10GB</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-white" />
                  <span className="text-sm">Analitik lanjutan</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-purple-300" />
                  <span className="text-sm text-purple-200">Dukungan prioritas</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="block text-center bg-white text-purple-600 px-6 py-3 rounded-full font-medium"
                >
                  Pilih Paket
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl p-8 border border-gray-200"
            >
              <h3 className="text-xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl font-bold mb-4">Rp1.000.000</p>
              <p className="text-gray-600 mb-8">Sempurna untuk organisasi besar</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Pengguna tidak terbatas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Pelaporan kustom</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Penyimpanan tidak terbatas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Analitik lanjutan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Dukungan prioritas</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="block text-center bg-white border border-purple-600 text-purple-600 px-6 py-3 rounded-full font-medium"
                >
                  Pilih Paket
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">
                Unduh Aplikasi Kami Dan
                <br />
                Mulai Uji Coba Gratis Anda
                <br />
                Untuk Memulai Hari Ini!
              </h2>
              <p className="text-purple-200 mb-8">
                Akses alat perencanaan strategis Anda di mana saja. Aplikasi seluler kami menyediakan semua fitur yang
                Anda butuhkan untuk tetap mengikuti inisiatif strategis organisasi Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    App Store
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Google Play
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              className="lg:w-1/2 mt-8 lg:mt-0"
            >
              <div className="relative h-[400px] w-[300px] mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="Antarmuka aplikasi e-renstra"
                    width={300}
                    height={600}
                    className="absolute top-0 left-0 rounded-3xl shadow-xl z-20"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=300"
                    alt="Antarmuka aplikasi e-renstra"
                    width={300}
                    height={600}
                    className="absolute top-10 -left-16 rounded-3xl shadow-xl z-10 opacity-80"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-100 relative"
          >
            <motion.div
              animate={{
                y: [0, 5, 0],
                x: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute top-4 left-4 h-6 w-6 rounded-full bg-purple-100"
            ></motion.div>
            <motion.div
              animate={{
                y: [0, -5, 0],
                x: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-blue-100"
            ></motion.div>
            <h2 className="text-2xl font-bold text-center mb-6">Berlangganan Newsletter Kami</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-3 rounded-full font-medium"
              >
                Berlangganan
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t pt-16 pb-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="font-bold text-xl">e-renstra</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                E-renstra adalah platform perencanaan strategis terkemuka untuk organisasi dari semua ukuran.
                Sederhanakan proses perencanaan Anda dan capai tujuan Anda.
              </p>
              <div className="flex gap-4">
                <motion.div whileHover={{ y: -5, scale: 1.1 }}>
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"></path>
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -5, scale: 1.1 }}>
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -5, scale: 1.1 }}>
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Produk</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Harga
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Integrasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Pembaruan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Perusahaan</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Pers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Berita
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Sumber Daya</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Panduan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Webinar
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-purple-600">
                    Dokumentasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} e-renstra. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
