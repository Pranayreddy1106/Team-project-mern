import { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import certificateService from '../services/certificateService';
import courseService from '../services/courseService';
import { AuthContext } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

// Helper to draw a beautiful, pixel-perfect certificate on any canvas element
const drawCertificateOnCanvas = (canvas, studentName, courseTitle, certId, issueDate, instructorName = 'Kranthi Goud') => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // 1. Background Clean Soft Cream Fill
  ctx.fillStyle = '#fcfbf7'; 
  ctx.fillRect(0, 0, width, height);

  // Subtle radial gradient light highlight in center
  const radialGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width / 1.5);
  radialGrad.addColorStop(0, '#ffffff');
  radialGrad.addColorStop(1, '#f7f5ee');
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Elegant Royal Navy Outer Border
  ctx.strokeStyle = '#0f172a'; // slate-900 (deep navy)
  ctx.lineWidth = 14;
  ctx.strokeRect(35, 35, width - 70, height - 70);

  // 3. Luxurious Gold Inner Border
  ctx.strokeStyle = '#c5a880'; // classic muted gold
  ctx.lineWidth = 4;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // 4. Intricate Golden Corner Flourishes
  const drawCornerFlourish = (x, y, rotation) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = '#c5a880';
    ctx.lineWidth = 3.5;
    
    // Classic academic bracket corner
    ctx.beginPath();
    ctx.moveTo(0, 35);
    ctx.lineTo(0, 0);
    ctx.lineTo(35, 0);
    ctx.stroke();

    // Secondary accent line
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, 35);
    ctx.lineTo(8, 8);
    ctx.lineTo(35, 8);
    ctx.stroke();

    // Center diagonal burst
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(24, 24);
    ctx.stroke();
    
    ctx.restore();
  };
  
  drawCornerFlourish(62, 62, 0);
  drawCornerFlourish(width - 62, 62, Math.PI / 2);
  drawCornerFlourish(width - 62, height - 62, Math.PI);
  drawCornerFlourish(62, height - 62, -Math.PI / 2);

  // 5. Header Section
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b'; 
  ctx.font = 'bold 30px Georgia, serif';
  ctx.letterSpacing = '12px';
  ctx.fillText('EDUFLOW ONLINE ACADEMY', width / 2, 140);

  ctx.fillStyle = '#0f172a'; 
  ctx.font = 'bold 56px "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 230);

  // Muted gold horizontal divider rule
  ctx.strokeStyle = '#c5a880';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 265);
  ctx.lineTo(width / 2 + 250, 265);
  ctx.stroke();

  // 6. Subtitle Presentational Text
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillStyle = '#475569';
  ctx.letterSpacing = '0px';
  ctx.fillText('This certificate is proudly and honorably presented to', width / 2, 320);

  // 7. Student Name (Large, Distinguished)
  ctx.font = 'bold 52px Georgia, "Times New Roman", serif';
  ctx.fillStyle = '#7c3aed'; // Royal EduFlow Purple
  ctx.fillText(studentName.toUpperCase(), width / 2, 400);

  // Fine double divider under name
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 320, 428);
  ctx.lineTo(width / 2 + 320, 428);
  ctx.stroke();

  // 8. Description Text
  ctx.font = '20px "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('for successfully mastering all video lectures, course curriculum, and final evaluations for', width / 2, 475);

  // 9. Course Title
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#0f172a'; // Deep navy
  ctx.fillText(`"${courseTitle}"`, width / 2, 530);

  // 10. Golden Seal / Badge Design
  const sealX = width / 2 - 320;
  const sealY = 675;
  ctx.save();
  ctx.translate(sealX, sealY);
  
  // Outer decorative ribbons
  ctx.fillStyle = '#b45309'; // dark golden-brown shadow
  ctx.beginPath();
  ctx.moveTo(-15, 30);
  ctx.lineTo(-30, 95);
  ctx.lineTo(0, 80);
  ctx.lineTo(30, 95);
  ctx.lineTo(15, 30);
  ctx.fill();

  // Draw starburst points
  ctx.fillStyle = '#d97706'; // gold color
  for (let i = 0; i < 32; i++) {
    ctx.rotate(Math.PI / 16);
    ctx.fillRect(-38, -38, 76, 76);
  }

  // Inner circular base
  ctx.fillStyle = '#fbbf24'; // bright gold
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.stroke();

  // Text inside the seal
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillStyle = '#78350f';
  ctx.fillText('EDUFLOW', 0, -4);
  ctx.font = '9px Arial, sans-serif';
  ctx.fillText('APPROVED', 0, 10);
  ctx.restore();

  // 11. Authoritative Signatures
  // Signature script rendering
  ctx.font = 'italic 34px "Brush Script MT", "Great Vibes", cursive, Georgia, serif';
  ctx.fillStyle = '#1e1b4b'; // calligraphic ink
  ctx.fillText(instructorName, width / 2 + 240, 655); // Calligraphic Signature

  // Signature line
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 + 100, 675);
  ctx.lineTo(width / 2 + 380, 675);
  ctx.stroke();

  // Official title label
  ctx.font = 'bold 15px "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('COURSE INSTRUCTOR', width / 2 + 240, 698);
  ctx.font = '13px "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Generated by Instructor of EduFlow`, width / 2 + 240, 718);

  // 12. Verification & Serial Details (Left footer)
  ctx.font = '14px Courier, monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText(`CERTIFICATE ID: ${certId.toUpperCase()}`, 100, 665);
  ctx.fillText(`ISSUED AT     : ${new Date(issueDate).toLocaleDateString()}`, 100, 688);
  ctx.fillText('VERIFY DIGITAL: eduflow.org/verify', 100, 711);
};

export default function CertificatesPage() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState({});
  const [selectedCert, setSelectedCert] = useState(null); // { course, certificate }
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const myCourses = await courseService.getMyCourses();
        setCourses(myCourses);

        const entries = await Promise.all(
          myCourses.map(async (course) => {
            try {
              const certificate = await certificateService.getCertificate(course._id);
              return [course._id, certificate];
            } catch {
              return [course._id, null];
            }
          })
        );

        setCertificates(
          entries.reduce((items, [courseId, certificate]) => {
            if (certificate) items[courseId] = certificate;
            return items;
          }, {})
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load certificates');
      }
    };

    loadCertificates();
  }, []);

  // Update canvas when selectedCert is opened
  useEffect(() => {
    if (selectedCert && canvasRef.current) {
      drawCertificateOnCanvas(
        canvasRef.current,
        user?.name || 'Valued Graduate',
        selectedCert.course.title,
        selectedCert.certificate.certificateId || selectedCert.certificate._id,
        selectedCert.certificate.issuedAt || selectedCert.certificate.createdAt,
        selectedCert.course.instructor?.name || 'Kranthi Goud'
      );
    }
  }, [selectedCert, user]);

  const handleDownloadPdf = (course, certificate) => {
    // Generate offscreen canvas at high resolution (1684 x 1190 points = A4 Landscape @ 150 DPI)
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.width = 1684;
    pdfCanvas.height = 1190;
    
    drawCertificateOnCanvas(
      pdfCanvas,
      user?.name || 'Valued Graduate',
      course.title,
      certificate.certificateId || certificate._id,
      certificate.issuedAt || certificate.createdAt,
      course.instructor?.name || 'Kranthi Goud'
    );

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [842, 595] // Scaled to fit exactly inside standard landscape page
    });

    const imgData = pdfCanvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, 842, 595);
    pdf.save(`Certificate_${(user?.name || 'Student').replace(/\s+/g, '_')}_${course.title.replace(/\s+/g, '_')}.pdf`);
  };

  const certifiedCourses = courses.filter((course) => certificates[course._id]);

  return (
    <div>
      <Navbar />

      <div className='p-6 md:p-10'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10'>
          <div>
            <h1 className='text-3xl md:text-5xl font-black'>Certificates</h1>
            <p className='text-gray-400 mt-3'>
              Certificates appear here automatically after you complete every lecture in a course.
            </p>
          </div>
          <Link
            to='/dashboard'
            className='inline-flex justify-center rounded-full border border-border px-5 py-3 font-semibold hover:border-primary hover:text-primary transition'
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className='bg-red-500/15 border border-red-500 text-red-300 rounded-2xl p-4 mb-8'>
            {error}
          </div>
        )}

        {certifiedCourses.length === 0 ? (
          <div className='rounded-3xl border border-border bg-card p-10 text-center'>
            <p className='text-2xl font-bold'>No certificates yet</p>
            <p className='text-gray-400 mt-3'>
              Finish all lectures in an enrolled course and your certificate will be created automatically.
            </p>
            <Link
              to='/courses'
              className='mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white hover:opacity-90 transition'
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {certifiedCourses.map((course) => {
              const certificate = certificates[course._id];

              return (
                <div key={course._id} className='bg-card rounded-3xl p-6 md:p-8 border border-border flex flex-col justify-between hover:shadow-xl hover:border-primary/20 transition-all duration-300'>
                  <div>
                    <div className='bg-dark/40 h-36 rounded-2xl mb-5 flex items-center justify-center text-primary text-3xl font-black border border-border/50'>
                      Certified
                    </div>
                    <h3 className='text-xl font-bold line-clamp-1'>{course.title}</h3>
                    <p className='text-gray-400 text-sm mt-3 font-mono'>
                      ID: {certificate.certificateId || certificate._id}
                    </p>
                    <p className='text-gray-400 text-sm mt-1'>
                      Issued: {new Date(certificate.issuedAt || certificate.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className='mt-6 flex flex-col gap-2.5'>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedCert({ course, certificate })}
                        className='inline-flex justify-center items-center rounded-full border border-primary text-primary py-2.5 font-semibold text-sm hover:bg-primary hover:text-white transition duration-200'
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(course, certificate)}
                        className='inline-flex justify-center items-center rounded-full bg-primary text-white py-2.5 font-semibold text-sm hover:opacity-90 transition duration-200'
                      >
                        Download PDF
                      </button>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className='inline-flex w-full justify-center rounded-full bg-dark/60 border border-border py-2.5 font-semibold text-sm hover:border-primary hover:text-white transition duration-200 text-gray-400'
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Immersive PDF Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border w-full max-w-5xl shadow-2xl relative">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark border border-border text-gray-400 hover:text-white transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-black mb-6 text-center">Certificate Preview</h2>

            <div className="flex justify-center overflow-hidden rounded-2xl border border-border bg-dark/70 p-2 md:p-4 mb-6 shadow-inner">
              <canvas
                ref={canvasRef}
                width={1200}
                height={850}
                className="max-w-full h-auto rounded-lg shadow-md border border-slate-700 bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  handleDownloadPdf(selectedCert.course, selectedCert.certificate);
                }}
                className="bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="border border-border hover:border-primary px-8 py-3.5 rounded-full font-bold transition text-gray-300 hover:text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
