import React, { useRef, useState, useEffect } from 'react';
import { FaFileAlt, FaRibbon, FaAward, FaDownload, FaEye, FaMagic } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectMyCourses } from '../../../slices/courseSlice';
import { apiClient } from '../../api/index';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../../assets/logo.png';

const Certificates = () => {
  const enrolledCourses = useSelector(selectMyCourses);
  const { user } = useSelector((state) => state.auth);
  const [downloadingId, setDownloadingId] = useState(null);
  const certificateRef = useRef(null);
  const [activeCert, setActiveCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState(null);

  const [earnedCertificates, setEarnedCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnedCertificates();
  }, []);

  const fetchEarnedCertificates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getMyCertificates();
      // res.data.data because the API returns a paginated structure
      setEarnedCertificates(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (courseId) => {
    try {
      Swal.fire({
        title: 'Generating Certificate...',
        text: 'Please wait while we process your request',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await apiClient.generateCertificate(courseId);

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your certificate has been generated.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchEarnedCertificates();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to generate certificate. Ensure course is completed.'
      });
    }
  };

  const certificates = enrolledCourses.map(course => {
    const isCompleted = course.status === 'completed' || course.progress === 100;
    const existingCert = earnedCertificates.find(c => c.course?.id === course.id);

    return {
      id: course.id,
      course: course.title,
      issueDate: existingCert ? new Date(existingCert.issued_at).toLocaleDateString() : (isCompleted ? new Date().toLocaleDateString() : null),
      instructor: course.instructor?.name || 'Bitcoderlabs Instructor',
      duration: course.duration || 'N/A',
      score: course.score || 'A',
      certificateId: existingCert ? existingCert.certificate_number : (isCompleted ? 'READY TO GENERATE' : 'LOCKED'),
      hasCertificate: !!existingCert,
      isLocked: !isCompleted,
      progress: course.progress || 0,
      studentName: user?.name || "Student Name",
      icon: (isCompleted || existingCert) ? (
        <FaAward className="mx-auto text-4xl text-primary" />
      ) : (
        <div className="relative inline-block">
          <FaAward className="mx-auto text-4xl text-gray-300" />
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )
    };
  });

  const generatePDF = async (cert) => {
    setDownloadingId(cert.id);
    setActiveCert(cert);

    // Give state a moment to update the hidden template
    await new Promise(resolve => setTimeout(resolve, 300));

    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate-${cert.course.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Certificate generation failed", error);
    } finally {
      setDownloadingId(null);
      // Don't clear activeCert if it's being viewed in modal
      if (!isModalOpen) setActiveCert(null);
    }
  };

  const handleViewCertificate = (cert) => {
    setViewingCert(cert);
    setActiveCert(cert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setViewingCert(null);
    if (downloadingId === null) setActiveCert(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-1">Your earned course certificates</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your certificates...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">{cert.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-center mb-2 line-clamp-1" title={cert.course}>{cert.course}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-medium">{cert.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span className="font-medium">{cert.issueDate || 'Pending'}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  {cert.isLocked ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Course Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                      <button disabled className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2">
                        <FaRibbon /> Certificate Locked
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {cert.hasCertificate ? (
                        <>
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="flex-1 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border border-primary/20"
                          >
                            <FaEye /> View
                          </button>
                          <button
                            onClick={() => generatePDF(cert)}
                            disabled={downloadingId === cert.id}
                            title="Download Certificate"
                            className="p-2 bg-gray-900 text-white hover:bg-black rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {downloadingId === cert.id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <FaDownload />
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleGenerateCertificate(cert.id)}
                          className="w-full py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <FaMagic /> Claim Certificate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {certificates.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                <FaFileAlt className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
              <p className="text-gray-600 mb-6">Complete courses to earn your official certificates.</p>
            </div>
          )}
        </>
      )}

      {/* Modal for viewing certificate */}
      {isModalOpen && viewingCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewingCert.course}</h3>
                <p className="text-sm text-gray-500">Certificate Preview</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generatePDF(viewingCert)}
                  disabled={downloadingId === viewingCert.id}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm"
                >
                  {downloadingId === viewingCert.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><FaDownload /> Download PDF</>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-200/50 flex justify-center items-start">
              {/* Scale the certificate to fit the modal width */}
              <div className="shadow-2xl origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]">
                <CertificateTemplate cert={viewingCert} innerRef={certificateRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Certificate Template for PDF Generation (only if modal is NOT open) */}
      {!isModalOpen && activeCert && (
        <div className="fixed top-0 left-0 z-[-10]" style={{ opacity: 0, pointerEvents: 'none' }}>
          <CertificateTemplate cert={activeCert} innerRef={certificateRef} />
        </div>
      )}
    </div>
  );
};

// Extracted Template for reuse
const CertificateTemplate = ({ cert, innerRef }) => {
  return (
    <div
      ref={innerRef}
      style={{
        width: '1123px', // A4 Landscape width (approx)
        height: '794px', // A4 Landscape height (approx)
        backgroundColor: '#ffffff',
        color: '#0f172a', // Slate 900
        fontFamily: "'Outfit', sans-serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '0', left: '0', right: '0', bottom: '0',
        border: '20px solid #ffffff',
        boxSizing: 'border-box',
        zIndex: 1
      }}>
        <div style={{
          width: '100%', height: '100%',
          border: '4px solid #1e3a8a', // Dark Blue
          padding: '4px',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%', height: '100%',
            border: '1px solid #b45309', // Dark Gold
            backgroundColor: '#ffffff',
            boxSizing: 'border-box'
          }}></div>
        </div>
      </div>

      {/* --- Corner Decorations --- */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '80px', height: '80px', borderTop: '4px solid #1e3a8a', borderLeft: '4px solid #1e3a8a', zIndex: 2 }}></div>
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '80px', height: '80px', borderTop: '4px solid #1e3a8a', borderRight: '4px solid #1e3a8a', zIndex: 2 }}></div>
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '80px', height: '80px', borderBottom: '4px solid #1e3a8a', borderLeft: '4px solid #1e3a8a', zIndex: 2 }}></div>
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '80px', height: '80px', borderBottom: '4px solid #1e3a8a', borderRight: '4px solid #1e3a8a', zIndex: 2 }}></div>


      {/* --- Main Content --- */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px 40px 80px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>

        {/* Header Section */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
            <span style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', color: '#1e3a8a', letterSpacing: '2px' }}>
              Bitcoderlabs Pvt Ltd
            </span>
          </div>

          <h1 style={{
            fontSize: '64px',
            fontFamily: "'Playfair Display', serif",
            color: '#1e3a8a',
            fontWeight: '900',
            textTransform: 'uppercase',
            margin: '10px 0 0 0',
            letterSpacing: '4px'
          }}>
            Certificate
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '400',
            color: '#b45309',
            textTransform: 'uppercase',
            letterSpacing: '8px',
            margin: '0 0 20px 0'
          }}>
            Of Completion
          </h2>

          <div style={{ width: '400px', height: '1px', background: 'linear-gradient(90deg, transparent, #b45309, transparent)', marginBottom: '20px' }}></div>

          <p style={{ fontSize: '18px', color: '#64748b', fontStyle: 'italic', fontFamily: "'Playfair Display', serif", margin: '0' }}>
            This certificate is proudly awarded to
          </p>
        </div>

        {/* Student Name */}
        <div style={{ margin: '20px 0', width: '100%' }}>
          <h2 style={{
            fontSize: '64px',
            fontFamily: "'Playfair Display', serif",
            color: '#0f172a',
            margin: '0',
            fontWeight: 'bold',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '10px',
            width: '80%',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            {cert.studentName}
          </h2>
        </div>

        {/* Course Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <p style={{ fontSize: '18px', color: '#64748b', fontStyle: 'italic', fontFamily: "'Playfair Display', serif", margin: '0' }}>
            For successfully completing the professional curriculum of
          </p>
          <h3 style={{
            fontSize: '36px',
            color: '#1e3a8a',
            // margin: '10px 0',
            fontWeight: '800'
          }}>
            {cert.course}
          </h3>
          <p style={{ fontSize: '16px', color: '#475569', maxWidth: '700px', lineHeight: '1.5', margin: '0' }}>
            Demonstrating dedication, technical proficiency, and excellence in the field of software development.
          </p>
        </div>

        {/* Signatures & Seal Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px 1fr',
          width: '100%',
          alignItems: 'end',
          marginTop: '40px'
        }}>

          {/* Director Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '32px', color: '#0f172a', marginBottom: '5px' }}>
              Bitcoder Labs
            </div>
            <div style={{ height: '1px', backgroundColor: '#94a3b8', width: '200px', margin: '0 auto 5px auto' }}></div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase' }}>
              Director
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Bitcoderlabs Pvt Ltd</div>
          </div>

          {/* Seal */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #b45309',
              boxShadow: '0 0 0 4px #fff, 0 0 0 6px #b45309',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', inset: '6px', border: '1px dashed #b45309', borderRadius: '50%' }}></div>
              <div style={{ textAlign: 'center' }}>
                <FaAward style={{ fontSize: '48px', color: '#b45309', display: 'block', margin: '0 auto 5px auto' }} />
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#b45309', textTransform: 'uppercase' }}>Verified</span>
              </div>
            </div>
          </div>

          {/* Instructor Signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '32px', color: '#0f172a', marginBottom: '5px' }}>
              {cert.instructor.split(' ')[0]} {/* Approximate signature */}
            </div>
            <div style={{ height: '1px', backgroundColor: '#94a3b8', width: '200px', margin: '0 auto 5px auto' }}></div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase' }}>
              Course Instructor
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{cert.instructor}</div>
          </div>

        </div>

        {/* Footer / QR Code Section */}
        <div style={{
          width: '100%',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '20px',
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Left: Certificate Info */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
              CERTIFICATE ID: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{cert.certificateId}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
              ISSUED ON: <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{cert.issueDate}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
              VERIFY AT: <span style={{ color: '#1e3a8a', fontWeight: 'bold' }}>bitcoderlabs.com/verify</span>
            </div>
          </div>

          {/* Right: QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '2px' }}>
                Scan to Verify
              </div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                Official Digital Certificate
              </div>
            </div>
            <div style={{
              padding: '6px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QRCodeCanvas
                value={`https://bitcoderlabs.com/verify/${cert.certificateId}`}
                size={70}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
