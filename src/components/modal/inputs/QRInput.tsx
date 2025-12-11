import { useEffect, useState } from "react";
import { getDeviceQR } from "@/services/api/DeviceAPI";
import type { GenericInputProps } from "../ModalInput";

// 모달 검색 입력박스 컴포넌트
const QRInput = ({ value }: GenericInputProps) => {
  const [qrSrc, setQrSrc] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const getQR = async () => {
      if (qrCode) return;
      if (value) {
        const res = await getDeviceQR({ deviceId: value as string });
        if (res.pass) {
          setQrSrc(res.data.qr_link);
          setQrCode(res.data.code);
        } else {
          setQrSrc("");
          setQrCode("");
        }
      }
    };
    getQR();
  }, [value]);

  return (
    <div className="min-h-[250px] text-center  justify-self-center">
      <div className="h-[303px]">
        {qrSrc && qrCode ? (
          <>
            <div className="w-[290px] h-[270px] overflow-hidden object-cover flex items-center">
              <img src={qrSrc} alt="QRCode" className="w-[400px] h-[400px] object-cover" />
            </div>
            <p className="text-[14px] mt-[12px]">{qrCode}</p>
          </>
        ) : (
          <>
            <div className="animate-pulse w-[270px] h-[270px] bg-gray-200 rounded-[8px]"></div>
            <p className="bg-gray-200 w-[80px] h-[14px] mt-[12px] rounded-[8px] justify-self-center"></p>
          </>
        )}
      </div>
    </div>
  );
};

export default QRInput;
