// frontend/src/components/QrScanner.js
import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = ({ onScan }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let selectedDeviceId;

        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReader.getVideoInputDevices();
                if (videoInputDevices.length > 0 && videoRef.current) {
                    selectedDeviceId = videoInputDevices[0].deviceId;
                    codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
                        if (result) {
                            onScan(result.getText());
                        }
                    });
                } else {
                    console.error("Aucune caméra trouvée.");
                }
            } catch (err) {
                console.error("Erreur lors de l'initialisation de la caméra :", err);
            }
        };

        startScanner();

        // Fonction de nettoyage pour arrêter la caméra proprement
        return () => {
            codeReader.reset();
        };
    }, [onScan]);

    return (
        <video
            ref={videoRef}
            style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                border: '1px solid #ccc'
            }}
        />
    );
};

export default QrScanner;