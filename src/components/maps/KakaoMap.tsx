import React, { useEffect } from "react"
import { Map } from "react-kakao-maps-sdk"
import type { MapProps } from "react-kakao-maps-sdk"

interface KakaoMapProps extends Partial<MapProps> {
  width?: string | number
  height?: string | number
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  width = "100%",
  height = "100%",
  level = 3,
  center = { lat: 37.5665, lng: 126.9780 },
  ...rest
}) => {
  useEffect(() => {
    // 지도 초기화 후 크기 재계산 강제 트리거
    window.dispatchEvent(new Event("resize"))
  }, [])

  return (
    <div style={{ width, height }}>
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={level}
        draggable={true} // 지도 드래그 가능
        zoomable={true} // 확대/축소 가능
        {...rest}
      />
    </div>
  )
}

export default KakaoMap
