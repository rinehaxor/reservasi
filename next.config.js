/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ['inaajkekdgfvnxcobdyc.supabase.co'],
   },
   webpack: (config) => {
      config.resolve.alias.canvas = false;

      return config;
   },
};

module.exports = nextConfig;
