"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion';
import { FaPlay, FaPause, FaUniversity, FaBox } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

// Helper component for animations that trigger on scroll
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`py-16 px-6 text-center ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Countdown Timer Component
const Countdown = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2026-04-12T00:00:00") - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval]) {
            return null;
        }
        return (
            <div key={interval} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-rose-900">{timeLeft[interval]}</span>
                <span className="text-xs uppercase text-stone-600">{interval}</span>
            </div>
        );
    });

    return (
        <div className="flex justify-around max-w-sm mx-auto p-6 bg-white/70 rounded-2xl shadow-inner backdrop-blur-sm border border-rose-100">
            {timerComponents.length ? timerComponents : <span className="text-xl font-semibold text-rose-900">The day has come!</span>}
        </div>
    );
};

// Guest Book / RSVP Form
const GuestBook = ({ guestName }: { guestName: string }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(data);
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000); // Reset form after 5 seconds
        reset();
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-8 bg-green-100 border border-green-300 rounded-2xl">
                <h3 className="text-xl font-semibold text-green-800">Terima Kasih!</h3>
                <p className="text-green-700">Ucapan dan konfirmasi Anda telah kami terima.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left max-w-sm mx-auto">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700">Nama</label>
                <input
                    type="text"
                    id="name"
                    defaultValue={guestName}
                    {...register("name", { required: "Nama tidak boleh kosong" })}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
                <label htmlFor="attendance" className="block text-sm font-medium text-stone-700">Konfirmasi Kehadiran</label>
                <select
                    id="attendance"
                    {...register("attendance", { required: "Mohon konfirmasi kehadiran Anda" })}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                >
                    <option value="">Pilih...</option>
                    <option value="hadir">Hadir</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                </select>
                {errors.attendance && <p className="text-red-500 text-xs mt-1">{errors.attendance.message as string}</p>}
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700">Ucapan & Doa</label>
                <textarea
                    id="message"
                    rows={4}
                    {...register("message", { required: "Tuliskan ucapan dan doa Anda" })}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-rose-900 text-white rounded-full font-medium shadow-md hover:bg-rose-800 transition-colors disabled:bg-stone-400"
            >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
        </form>
    );
};

// Wedding Gift Component
const GiftItem = ({ icon, title, details, accountNumber }: { icon: React.ReactNode, title: string, details: string, accountNumber: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-100 flex items-center space-x-4">
            <div className="text-3xl text-rose-800">{icon}</div>
            <div className="flex-grow text-left">
                <h4 className="font-bold text-rose-900">{title}</h4>
                <p className="text-sm text-stone-600">{details}</p>
                <p className="text-sm font-semibold text-stone-800">{accountNumber}</p>
            </div>
            <button onClick={handleCopy} className="px-3 py-1 text-xs bg-amber-600 text-white rounded-full hover:bg-amber-700 transition">
                {copied ? 'Tersalin!' : 'Salin'}
            </button>
        </div>
    );
};

// Main Component
function PageContent() {
  const searchParams = useSearchParams();
  const guestName = useMemo(() => {
    const toParam = searchParams.get('to');
    return toParam ? decodeURIComponent(toParam) : 'Tamu Kehormatan';
  }, [searchParams]);

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isOpened && audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed on state change:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, isOpened]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (!isOpened) {
    return (
      <AnimatePresence>
        <motion.div 
          className="flex items-center justify-center min-h-screen bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/1000950288.jpg"
              alt="Adinda & Fauzan"
              fill
              className="object-cover object-[center_20%] opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
          <motion.div 
            className="relative w-full max-w-md min-h-screen text-white flex flex-col items-center justify-between p-8 py-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants} 
              className="z-10 text-left self-start"
            >
              <p className="text-lg tracking-wider text-gray-200 font-light">The Wedding Of</p>
              <h1 className="text-5xl font-ivymode text-white mt-2" style={{ textShadow: '0 3px 10px rgba(0, 0, 0, 0.5)' }}>Adinda & Fauzan</h1>
            </motion.div>

            <motion.div 
              className="z-10 text-center"
              variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
            >
              <motion.div variants={itemVariants}>
                <p className="text-base text-gray-300">Kepada Yth.</p>
                <p className="text-xl font-semibold text-white mt-1">{guestName}</p>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                onClick={handleOpenInvitation}
                className="mt-8 px-8 py-3 bg-white/90 hover:bg-white text-black font-bold rounded-full transition-all duration-300 shadow-2xl shadow-white/20 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buka Undangan
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <audio ref={audioRef} src="/lagu.mp3" loop />
      <motion.button
        onClick={toggleAudio}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-rose-900 text-white rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </motion.button>

      <motion.div 
        className="flex justify-center min-h-screen bg-neutral-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md bg-stone-50 text-stone-800 shadow-2xl overflow-x-hidden">
          
          <motion.section 
            className="relative py-20 px-6 bg-rose-950 text-center text-amber-50 rounded-b-[3rem] shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')]"></div>
            <h2 className="text-3xl font-serif text-gray-100 mb-6">Dua Hati Dipersatukan Dalam Cinta</h2>
            <p className="text-sm font-light leading-relaxed italic text-amber-100/80 max-w-xs mx-auto">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
              <br/><br/>
              <span className="font-semibold text-gray-100">(QS. Ar-Rum: 21)</span>
            </p>
          </motion.section>

          <AnimatedSection>
             <div className="relative w-full max-w-xs mx-auto rounded-2xl shadow-2xl overflow-hidden border-8 border-white">
                <Image
                  src="/1000950268.jpg"
                  alt="Adinda & Fauzan Pre-wedding"
                  width={400}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <h3 className="text-2xl font-serif text-amber-300">Adinda & Fauzan</h3>
                </div>
              </div>
          </AnimatedSection>

          <AnimatedSection>
            <p className="text-sm text-rose-900 mb-8 font-medium">Dengan memohon Rahmat dan Ridha Allah SWT., kami bermaksud untuk menikahkan putra-putri kami:</p>
            <div className="mb-10">
              <h3 className="text-3xl font-serif text-rose-900 font-bold mb-2">Adinda Fajrie Maulidya</h3>
              <p className="text-sm text-stone-600">Putri dari Bapak Tubagus Achmad & Ibu Usty Yanuvitsa</p>
            </div>
            <p className="text-4xl font-serif text-amber-600 mb-10">&</p>
            <div className="mb-10">
              <h3 className="text-3xl font-serif text-rose-900 font-bold mb-2">Arya Maulana Fauzan</h3>
              <p className="text-sm text-stone-600">Putra dari Bapak Dede Mulyana & Ibu Haryati</p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-rose-900/5">
            <h2 className="text-2xl font-serif text-rose-900 font-bold mb-8 border-b-2 border-amber-500 inline-block pb-2">Menghitung Hari</h2>
            <Countdown />
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-2xl font-serif text-rose-900 font-bold mb-8 border-b-2 border-amber-500 inline-block pb-2">Jadwal Acara</h2>
            <p className="text-xl font-semibold text-stone-800 mb-8">Minggu, 12 April 2026</p>
            <div className="space-y-6 max-w-sm mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
                <h4 className="text-xl font-bold text-rose-900 mb-2">Akad Nikah</h4>
                <p className="text-stone-600 font-medium">08.00 WIB s.d Selesai</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
                <h4 className="text-xl font-bold text-rose-900 mb-2">Resepsi</h4>
                <p className="text-stone-600 font-medium">11.00 WIB s.d Selesai</p>
            </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-rose-900/5 !py-0">
            <div className="w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.707695842335!2d107.08540927474616!3d-6.805508593192443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e684e6959841899%3A0x14365c1ae7133a4!2sSafira%20Garden!5e0!3m2!1sen!2sid!4v1712333305123!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border:0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Location"
              ></iframe>
            </div>
            <div className="py-16">
              <h2 className="text-2xl font-serif text-rose-900 font-bold mb-6">Bertempat</h2>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Safira Garden Cianjur</h3>
              <p className="text-sm text-stone-600 mb-8 leading-relaxed max-w-xs mx-auto">
                Jl. Raya Puncak - Cianjur, Cijedil, Kec. Cugenang, Kabupaten Cianjur, Jawa Barat.
              </p>
              <a 
                href="https://maps.app.goo.gl/ek2jbZpXv5QekF0EE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-rose-900 text-white rounded-full font-medium shadow-md hover:bg-rose-800 transition-colors"
              >
                Buka di Google Maps
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-2xl font-serif text-rose-900 font-bold mb-8 border-b-2 border-amber-500 inline-block pb-2">Buku Tamu & Ucapan</h2>
            <GuestBook guestName={guestName} />
          </AnimatedSection>

          <AnimatedSection className="bg-rose-900/5">
            <h2 className="text-2xl font-serif text-rose-900 font-bold mb-8 border-b-2 border-amber-500 inline-block pb-2">Kirim Hadiah</h2>
            <p className="text-sm text-stone-600 mb-8 max-w-sm mx-auto">
              Doa restu Anda adalah hadiah terindah bagi kami. Namun, jika Anda ingin memberikan tanda kasih, kami dengan senang hati menerimanya.
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <GiftItem 
                icon={<FaUniversity />}
                title="Bank BCA"
                details="a.n Adinda Fajrie"
                accountNumber="3480375571 "
              />
              <GiftItem 
                icon={<FaBox />}
                title="Kirim Hadiah"
                details="Jl. Gatotmangkupraja No. 11, Panumbangan, Cugenang, Cianjur"
                accountNumber="Penerima: Adinda & Fauzan"
              />
            </div>
          </AnimatedSection>

          <motion.section 
            className="py-16 px-6 bg-rose-950 text-center text-amber-50"
          >
            <p className="text-sm leading-relaxed mb-6 font-light">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do&rsquo;a restu kepada kami.
            </p>
            <h2 className="text-3xl font-serif text-white mt-8">Adinda & Fauzan</h2>
          </motion.section>

        </div>
      </motion.div>
    </>
  );
}

export default function LuxuryMaroonInvitation() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}