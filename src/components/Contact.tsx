import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por tu mensaje. Te contactaré pronto.",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'keita@example.com',
      href: 'mailto:keita@example.com'
    },
    {
      icon: <Phone size={20} />,
      label: 'Teléfono',
      value: '+34 123 456 789',
      href: 'tel:+34123456789'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Ubicación',
      value: 'Madrid, España',
      href: '#'
    }
  ];

  const socialLinks = [
    {
      icon: <Github size={24} />,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'hover:text-gray-400'
    },
    {
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'hover:text-blue-500'
    },
    {
      icon: <Twitter size={24} />,
      label: 'Twitter',
      href: 'https://twitter.com',
      color: 'hover:text-sky-500'
    }
  ];

  return (
    <section id="contacto" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hablemos de tu <span className="text-gradient">proyecto</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Tienes una idea en mente? Me encantaría escuchar sobre tu proyecto 
            y ver cómo podemos trabajar juntos para hacerlo realidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="fade-in-up">
            <div className="card-portfolio">
              <h3 className="text-2xl font-bold mb-6">Envíame un mensaje</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntame sobre tu proyecto..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-gradient w-full flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Enviar mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="fade-in-up space-y-8">
            <div className="card-portfolio">
              <h3 className="text-2xl font-bold mb-6">Información de contacto</h3>
              
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-accent/10 transition-colors duration-300 group"
                  >
                    <div className="text-accent group-hover:scale-110 transition-transform">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="card-portfolio">
              <h3 className="text-2xl font-bold mb-6">Sígueme en redes</h3>
              
              <div className="flex space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground ${social.color} transition-all duration-300 hover:scale-110`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              <p className="text-muted-foreground mt-6 leading-relaxed">
                Sígueme en mis redes sociales para estar al día con mis últimos proyectos, 
                artículos técnicos y actualizaciones profesionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};