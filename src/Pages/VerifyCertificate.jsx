import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { FaQrcode, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaCamera } from 'react-icons/fa';
import { apiClient } from '../api';

const VerifyCertificate = () => {
    const { id } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, scanning, verifying, success, error
    const [certData, setCertData] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const controlsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            verifyCertificate(id);
        }
    }, [id]);

    const verifyCertificate = async (certId) => {
        setVerificationStatus('verifying');
        try {
            const res = await apiClient.verifyCertificate(certId);

            if (res.success && res.data?.certificate) {
                const cert = res.data.certificate;
                setCertData({
                    id: cert.certificate_number,
                    studentName: cert.user?.name || "N/A",
                    course: cert.course?.title || "N/A",
                    issueDate: new Date(cert.issued_at).toLocaleDateString(),
                    instructor: cert.metadata?.instructor_name || "Bitcoderlabs Instructor",
                    status: cert.status || "Valid"
                });
                setVerificationStatus('success');
            } else {
                throw new Error(res.message || "Certificate not found or invalid");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Certificate verification failed");
            setVerificationStatus('error');
        }
    };

    const startScanner = async () => {
        setVerificationStatus('scanning');
        const codeReader = new BrowserMultiFormatReader();

        try {
            const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            if (videoInputDevices.length === 0) {
                throw new Error("No camera found");
            }
            const selectedDeviceId = videoInputDevices[0].deviceId;

            const controls = await codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        const code = result.getText();
                        console.log("Scanned QR:", code);

                        // Check if it's a verification URL or just the ID
                        let extractedId = code;
                        if (code.includes('/verify/')) {
                            extractedId = code.split('/verify/').pop();
                        }

                        controls.stop();
                        navigate(`/verify/${extractedId}`);
                    }
                }
            );
            controlsRef.current = controls;
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not access camera");
            setVerificationStatus('error');
        }
    };

    const stopScanner = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
        }
        setVerificationStatus('idle');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <FaQrcode className="text-3xl text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Certificate Verification</h1>
                    <p className="text-gray-600 mt-2">Verify the authenticity of Bitcoderlabs certificates</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {verificationStatus === 'idle' && (
                            <div className="text-center space-y-6 py-8">
                                <div className="max-w-md mx-auto aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <FaCamera className="text-5xl mb-3" />
                                        <p>Camera inactive</p>
                                    </div>
                                </div>
                                <button
                                    onClick={startScanner}
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2 mx-auto"
                                >
                                    <FaCamera /> Start Scanning QR Code
                                </button>
                                <p className="text-sm text-gray-400">Please allow camera access when prompted</p>
                            </div>
                        )}

                        {verificationStatus === 'scanning' && (
                            <div className="space-y-6 py-4">
                                <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-w-md mx-auto">
                                    <video ref={videoRef} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none">
                                        <div className="w-full h-full border-2 border-primary animate-pulse rounded-lg"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary font-medium flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                                        Scanning for QR code...
                                    </p>
                                    <button
                                        onClick={stopScanner}
                                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
                                    >
                                        Cancel Scanning
                                    </button>
                                </div>
                            </div>
                        )}

                        {verificationStatus === 'verifying' && (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                                <p className="text-gray-600 font-medium">Verifying certificate credentials...</p>
                            </div>
                        )}

                        {verificationStatus === 'success' && certData && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 mb-6">
                                    <div className="p-3 bg-green-500 rounded-full text-white">
                                        <FaCheckCircle className="text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-800">Verified Successfully</h3>
                                        <p className="text-green-600 font-medium">This is an authentic Bitcoderlabs document.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Name</label>
                                        <p className="text-lg font-bold text-gray-900">{certData.studentName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Title</label>
                                        <p className="text-lg font-bold text-gray-900">{certData.course}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Certificate ID</label>
                                        <p className="text-md font-mono font-bold text-primary">{certData.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Date</label>
                                        <p className="text-lg font-bold text-gray-900">{certData.issueDate}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t mt-6 flex gap-4">
                                    <button
                                        onClick={() => { setVerificationStatus('idle'); setCertData(null); navigate('/verify'); }}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCamera /> Scan Another
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        Return Home
                                    </button>
                                </div>
                            </div>
                        )}

                        {verificationStatus === 'error' && (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
                                    <FaExclamationTriangle className="text-4xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Verification Failed</h3>
                                    <p className="text-gray-500 mt-2">{error || "The certificate could not be verified."}</p>
                                </div>
                                <div className="pt-4 flex flex-col gap-3">
                                    <button
                                        onClick={() => { setVerificationStatus('idle'); setError(null); }}
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-12 text-center text-gray-400 text-sm">
                    <p>© 2026 Bitcoderlabs Pvt Ltd. All rights reserved.</p>
                    <p>Secured by Bitcoderlabs Digital Verification System</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
