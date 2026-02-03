import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowRight, Compass } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-green-50/50">
        <div className="max-w-xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative inline-block"
          >
            <div className="absolute inset-0 bg-kama-olive/10 blur-3xl rounded-full" />
            <Compass className="w-24 h-24 text-kama-olive mx-auto relative animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-display text-kama-olive mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-display text-foreground mb-6"
          >
            Lost in the Woods?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg mb-10 max-w-md mx-auto"
          >
            The path you followed seems to have vanished into the mist. Let us guide you back to the sanctuary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/">
              <button className="px-8 py-3 bg-kama-olive text-kama-cream rounded-full hover:bg-kama-olive-light transition-all flex items-center gap-2 group">
                <Home className="w-4 h-4" />
                Back to Sanctuary
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/products">
              <button className="px-8 py-3 bg-white border border-border text-foreground rounded-full hover:bg-muted transition-all">
                Shop Our Collection
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
