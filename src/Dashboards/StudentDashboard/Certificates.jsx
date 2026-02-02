import React, { useRef, useState, useEffect } from 'react';
import { FaFileAlt, FaRibbon, FaAward, FaDownload, FaEye, FaMagic } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectMyCourses } from '../../../slices/courseSlice';
import { apiClient } from '../../api/index';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import companyLogo from '../../assets/bitcoderlabs-logo.png';

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
  const [qrCodeUrls, setQrCodeUrls] = useState({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEarnedCertificates();
  }, []);

  const fetchQrCodeBlob = async (certificateId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1';
      const response = await fetch(`${baseUrl}/certificates/${certificateId}/qr`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'image/svg+xml',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setQrCodeUrls(prev => ({ ...prev, [certificateId]: url }));
      }
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
    }
  };

  const fetchEarnedCertificates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getMyCertificates();
      const certs = res?.data?.certificates || [];
      setEarnedCertificates(certs);
      certs.forEach(cert => {
        if (cert.id && !qrCodeUrls[cert.id]) {
          fetchQrCodeBlob(cert.id);
        }
      });
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
        if (res.data?.certificate) {
          setEarnedCertificates(prev => [...prev, res.data.certificate]);
        } else {
          fetchEarnedCertificates();
        }
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
    const existingCert = earnedCertificates.find(c => String(c.course?.id) === String(course.id));

    return {
      id: course.id,
      certificateId: existingCert?.id,
      courseTitle: course.title,
      certificate_number: existingCert?.certificate_number,
      issueDate: existingCert ? new Date(existingCert.issue_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : (isCompleted ? new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : null),
      instructorName: existingCert?.instructor?.name || course.instructor?.name || 'Bitcoderlabs Instructor',
      instructorTitle: existingCert?.instructor?.title || 'Director of Certification',
      platformName: existingCert?.platform?.name || 'Bitcoderlabs',
      qrCodeUrl: qrCodeUrls[existingCert?.id] || null,
      verificationUrl: existingCert?.verification?.url || existingCert?.verification_url,
      studentName: existingCert?.user?.name || user?.name || "Student Name",

      hasCertificate: !!existingCert,
      isLocked: !isCompleted,
      progress: course.progress || 0,
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

    await new Promise((resolve) => setTimeout(resolve, 800));
    const element = certificateRef.current;
    console.log(element);
    if (!element) return;

    try {
      // 1️⃣ Find QR canvas inside the certificate
      const qrCanvas = element.querySelector("canvas");
      console.log(qrCanvas);
      console.log("jshdgfa");

      // 2️⃣ Capture certificate
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate-${cert.courseTitle.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Certificate generation failed", error);
      Swal.fire("Error", "Failed to generate PDF. Please try again.", "error");
    } finally {
      setDownloadingId(null);
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
                  <h3 className="font-semibold text-gray-900 text-center mb-2 line-clamp-1" title={cert.courseTitle}>{cert.courseTitle}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Instructor:</span>
                      <span className="font-medium text-gray-900">{cert.instructorName}</span>
                    </div>
                    {cert.certificate_number && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">ID:</span>
                        <span className="font-mono text-primary/70">{cert.certificate_number}</span>
                      </div>
                    )}
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
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                      <button disabled className="w-full py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2">
                        <FaRibbon /> Certificate Locked
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {cert.hasCertificate ? (
                        <>
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="flex-1 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-extrabold transition-all flex items-center justify-center gap-2 border border-primary/20"
                          >
                            <FaEye /> View
                          </button>
                          <button
                            onClick={() => generatePDF(cert)}
                            disabled={downloadingId === cert.id}
                            title="Download Certificate"
                            className="p-2.5 bg-gray-900 text-white hover:bg-black rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
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
        </>
      )}

      {/* Modal for viewing certificate */}
      {isModalOpen && viewingCert && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b flex justify-between items-center bg-gray-50/80 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FaAward className="text-2xl text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{viewingCert.courseTitle}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digital Certificate Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generatePDF(viewingCert)}
                  disabled={downloadingId === viewingCert.id}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary-dark transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
                >
                  {downloadingId === viewingCert.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <><FaDownload /> Download PDF</>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="p-2.5 hover:bg-gray-200 rounded-full transition-all text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-12 bg-gray-100 flex justify-center items-start">
              <div className="origin-top">
                <CertificateTemplate cert={viewingCert} innerRef={certificateRef} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Certificate Template for PDF Generation */}
      {!isModalOpen && activeCert && (
        <div
          className="fixed top-0 left-0"
          style={{
            opacity: 1,
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          <CertificateTemplate cert={activeCert} innerRef={certificateRef} />
        </div>
      )}
    </div>
  );
};

// Certificate Template Component
const CertificateTemplate = ({ cert, innerRef }) => {
  return (
    <div
      ref={innerRef}
      className="relative w-[1123px] h-[794px] flex overflow-hidden"
      style={{
        boxShadow: 'inset 0 0 0 12px #2a9fd8, inset 0 0 0 24px #000000',
        background: 'linear-gradient(to right, #f3f4f6 0%, #f3f4f6 35%, white 35%, white 100%)',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Left Section */}
      <div className="relative w-[35%] flex items-center justify-center">
        <div>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[419px] flex flex-col items-center pt-32"
            style={{ backgroundColor: '#2a9fd8' }}
          >
            <div
              className="w-44 h-44 bg-white rounded-full flex items-center justify-center relative shadow-md"
              style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center z-10 overflow-hidden">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
          <div className="relative mt-35">
            <div
              className="w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-t-[100px]"
              style={{ borderTopColor: '#2a9fd8' }}
            ></div>
          </div>
        </div>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center w-64">
          <p className="text-3xl font-semibold mb-4" style={{ color: '#374151' }}>
            {cert.issueDate || '16th July, 2023'}
          </p>
          <div className="w-48 mx-auto pt-2" style={{ borderTop: '2px solid #9ca3af' }}>
            <p className="text-base font-medium" style={{ color: '#4b5563' }}>Date of Award</p>
          </div>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="w-[65%] flex flex-col py-12 px-16">
        <div className="flex items-start justify-end mb-16">
          <div className="text-right">
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#374151', letterSpacing: '0.02em' }}>
              {cert.platformName || 'Bitcoderlabs'}
            </h1>
            <p className="text-sm tracking-[0.25em] uppercase font-light" style={{ color: '#6b7280' }}>
              EMPOWER YOURSELF
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-5xl font-light tracking-wide" style={{ color: '#4b5563', fontFamily: 'Georgia, serif' }}>
            CERTIFICATE
          </h2>
        </div>

        <div className="mb-8">
          <h3 className="text-6xl font-bold uppercase tracking-wide" style={{ color: '#1f2937' }}>
            {cert.studentName}
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-lg leading-relaxed" style={{ color: '#4b5563' }}>
            has received this award for successfully<br />
            completing the course:
          </p>
        </div>

        <div className="mb-16">
          <h4 className="text-3xl font-bold leading-snug" style={{ color: '#1f2937' }}>
            {cert.courseTitle}
          </h4>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex-shrink-0">
            <p className="text-sm mb-2" style={{ color: '#4b5563' }}>
              To verify:
            </p>

            {!cert.qrCodeUrl && (
              <div>
                <QRCodeCanvas
                  value={
                    cert.verificationUrl ||
                    `https://bitcoderlabs.com/verify/${cert.certificate_number || 'cert'}`
                  }
                  size={80}
                  level="H"
                />
              </div>
            )}

            {cert.qrCodeUrl && (
              <img
                src={cert.qrCodeUrl}
                alt="QR Code"
                className="w-24 h-24"
                crossOrigin="anonymous"
              />
            )}

            <p className="text-xs font-mono mt-2" style={{ color: '#4b5563' }}>
              {cert.certificate_number || '2327-27963446'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
