import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', data);
      
      // Reset form after successful submission
      reset();
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {submitSuccess && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Your message has been sent! We'll get back to you soon.
        </div>
      )}
      
      {submitError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="form-label">Your Name</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="form-input"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Your Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="form-input"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="form-label">Subject</label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className="form-input"
          placeholder="How can we help you?"
        />
        {errors.subject && (
          <p className="form-error">{errors.subject.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message" className="form-label">Your Message</label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="form-input resize-none"
          placeholder="Tell us more about your inquiry..."
        ></textarea>
        {errors.message && (
          <p className="form-error">{errors.message.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary py-3 px-6"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default ContactForm;