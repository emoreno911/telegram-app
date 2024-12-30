export async function uploadJsonMetadata({
    username= "DominickToretto",
    bestScore= 0,
    totalScore= 0,
    avgTime= 0
}) {
    const data = { username, bestScore, totalScore, avgTime };

    const svgString = generateStringSVG(data);
    const blob = new Blob([svgString], { type: "image/svg+xml" }); 
    const base64 = await blob2base64(blob, { type: "image/svg+xml" })

    const content = {
			"name":"Guess the beat NFT",
			"description":"A Telegram mini-app for music lovers",
			"image": base64,
			"attributes":[
					{"trait_type":"username","value":username},
					{"trait_type":"best","value":bestScore},
					{"trait_type":"total","value":totalScore},
					{"trait_type":"avg","value":avgTime}
			]
    }

    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    const options = {
        method: 'POST',
        headers: {Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json'},
        body: `{"pinataOptions":{"cidVersion":1},"pinataMetadata":{"name":"${pseudoRandId()}.json"},"pinataContent":${JSON.stringify(content)}}`
    };

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options);
        const { IpfsHash } = await response.json();
        const tokenUri = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
        //const ipfsUri = `ipfs://${IpfsHash}`;
        console.log("IpfsHash generated")
        return tokenUri;
    } catch (error) {
        console.error(error);
        return "";
    }
}

const blob2base64 = (blob, mimeType) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrlPrefix = `data:${mimeType};base64,`;
        const base64WithDataUrlPrefix = reader.result;
        const base64 = base64WithDataUrlPrefix.replace(dataUrlPrefix, '');
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
};

export const pseudoRandId = () => {
    const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";

    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
};

function generateStringSVG({
    username = "DominickToretto",
    bestScore = 0,
    totalScore = 0,
    avgTime = 0
}) {
    return(
`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="eWSLi8rbaTl1" viewBox="0 0 400 400" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" width="400" height="400" style="background-color:#10021d">
  <style>
    <![CDATA[#eWSLi8rbaTl2 {animation: eWSLi8rbaTl2_s_do 12000ms linear infinite normal forwards}@keyframes eWSLi8rbaTl2_s_do { 0% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 300}} #eWSLi8rbaTl3 {animation: eWSLi8rbaTl3_s_do 12000ms linear infinite normal forwards}@keyframes eWSLi8rbaTl3_s_do { 0% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 360}} #eWSLi8rbaTl4 {animation: eWSLi8rbaTl4_s_do 12000ms linear infinite normal forwards}@keyframes eWSLi8rbaTl4_s_do { 0% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 500}} #eWSLi8rbaTl5 {animation: eWSLi8rbaTl5_s_do 12000ms linear infinite normal forwards}@keyframes eWSLi8rbaTl5_s_do { 0% {stroke-dashoffset: 0} 100% {stroke-dashoffset: 360}}]]>
    .baseTop { font-family: Tahoma; font-weight: 400; fill: #aaa }
    .baseBottom { font-family: Tahoma; font-weight: 700; fill: #ddd; font-size:1.5em }
    .username { font-family: Tahoma; font-weight: 700; fill: #ddd; font-size:2em }
  </style>
  <defs>
    <linearGradient id="eWSLi8rbaTl2-stroke" x1="0" y1="0.5" x2="1" y2="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)">
      <stop id="eWSLi8rbaTl2-stroke-0" offset="0%" stop-color="#0036a4"/>
      <stop id="eWSLi8rbaTl2-stroke-1" offset="49%" stop-color="#6a2364"/>
      <stop id="eWSLi8rbaTl2-stroke-2" offset="100%" stop-color="#4cceff"/>
    </linearGradient>
    <linearGradient id="eWSLi8rbaTl3-stroke" x1="0" y1="0.5" x2="1" y2="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)">
      <stop id="eWSLi8rbaTl3-stroke-0" offset="0%" stop-color="#fff"/>
      <stop id="eWSLi8rbaTl3-stroke-1" offset="48%" stop-color="#359fad"/>
      <stop id="eWSLi8rbaTl3-stroke-2" offset="100%" stop-color="#fff"/>
    </linearGradient>
    <linearGradient id="eWSLi8rbaTl4-stroke" x1="0" y1="0.5" x2="1" y2="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)">
      <stop id="eWSLi8rbaTl4-stroke-0" offset="0%" stop-color="#ae3bd4"/>
      <stop id="eWSLi8rbaTl4-stroke-1" offset="48%" stop-color="#2bc4c3"/>
      <stop id="eWSLi8rbaTl4-stroke-2" offset="100%" stop-color="#ff00f6"/>
    </linearGradient>
    <radialGradient id="eWSLi8rbaTl5-stroke" cx="0" cy="0" r="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0.5 0.5)">
      <stop id="eWSLi8rbaTl5-stroke-0" offset="0%" stop-color="rgba(34,56,133,0.52)"/>
      <stop id="eWSLi8rbaTl5-stroke-1" offset="100%" stop-color="rgba(255,176,195,0.77)"/>
    </radialGradient>
  </defs>
  <path id="eWSLi8rbaTl2" d="M60.541022,192.774999C21.003392,149.132773,93.618712,74.10143,146.858559,55.491904c25.3958-8.876883,61.369124-18.889738,84.461248-.683004c42.516928,33.522007,12.613092,96.213556-20.419205,126.355089-13.578345,12.390061-44.521289,36.551454-69.610911,27.320018-33.103858-12.180175-16.823018-54.569106-5.568868-73.081053c24.07487-39.600761,95.400244-87.472814,159.641028-71.715053c82.361973,20.202746-34.858651,121.117467,5.568868,152.992112c5.987432,4.720727,20.191563,5.768409,27.844362,5.464007c79.76103-3.172666,61.156692-66.684253,111.37746-71.032049c39.016973-3.377841,25.565954,56.863245,91.886406,71.032049c51.281274,10.955813,113.471303-35.496578,103.024153-72.398049-11.110162-39.243393-64.628714-56.266562-100.239713-19.807016-63.22493,64.731463-24.457648,130.034964-131.796666,180.995126-33.182731,15.753795-73.719869,28.091627-113.23375,30.735022-67.502613,4.515784-159.249621-31.311075-119.730779-89.473065" opacity="0.16" fill="none" stroke="url(#eWSLi8rbaTl2-stroke)" stroke-width="40" stroke-linecap="round" stroke-dasharray="0.01,300"/>
  <path id="eWSLi8rbaTl3" d="M548.836753,44.624992c26.916212-47.425639,99.388234-12.558714,103.049491,22.466344c3.251243,31.102646-70.55417,52.435347-66.826483,90.839065.879618,9.062024,10.329678,16.183054,16.706615,23.222019c22.659712,25.01212,36.15069,53.012162,25.059934,83.326063-6.256675,17.101086-71.228523,57.873574-88.173827,41.663027-16.765407-16.038445,14.01447-20.909212,28.772513-18.441016c44.400398,7.42573,39.199862,48.178358,11.137747,65.568042-18.861882,11.68843-40.657433,17.627774-64.970182,18.441016-12.759071.426775-28.762073.008452-38.05397-7.513002-14.587089-11.807732-11.245004-34.497301-15.778476-49.176038-8.945896-28.965543-56.379513-49.881526-94.670845-41.663027-50.048296,10.741896-52.094214,78.458176-20.419205,101.76707c15.367315,11.308446,43.972474,9.148501,51.048007-7.513002c2.032339-4.785771-3.04294-10.393113-5.568868-14.343009-15.043565-23.524194-33.730117-41.728469-71.467212-43.712031-33.131218-1.741464-71.203717,3.688551-103.024153,10.24501-46.009639,9.480073-118.415138,48.817966-164.281757,18.441016-30.66551-20.309424,12.75807-68.343305,39.91026-79.911059c32.212799-13.723741,72.026579-3.504685,106.736732-6.147003c52.230596-3.976064,154.450764-47.459715,159.641028-89.473065c2.788051-22.568321-26.790438-36.532239-53.832435-40.297027-66.712859-9.287755-138.894203-1.825607-204.192017-19.124012-38.477878-10.193385-22.449204-66.152738,9.281458-77.179052C202.82374,-6.519584,308.91142,55.028095,392.933642,79.385358c32.624072,9.457415,97.636197-12.294022,85.5703-86.837121" fill="none" stroke="url(#eWSLi8rbaTl3-stroke)" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.01,72"/>
  <path id="eWSLi8rbaTl4" d="M24.64077,109.435733c9.77732-43.169398,95.29382-75.504329,126.227798-37.565028c28.480004,34.929606-79.556979,105.03965-48.263567,133.185096c9.979064,8.975215,99.164752-4.578146,116.018189-5.464007c93.293239-4.903741,184.235846,9.270784,259.880752,51.908037c26.810744,15.111878,73.176735,45.294034,53.832447,73.764048-7.509408,11.051993-27.178976,16.53514-41.766549,20.490012-72.26474,19.591865-195.886634,17.364906-222.754932-49.859033-8.777012-21.959907-7.219284-41.875131,11.137747-60.787039c36.960368-38.077569,109.24079-44.427048,143.862563-82.643059c45.553107-50.282182-10.10387-104.320783-87.245677-99.718067-42.685767,2.546875-79.978052,61.797144-30.628802,76.496056c68.896959,20.521288,142.09535-9.350216,213.473474,30.735022c43.562291,24.464147,12.890189,75.964408,54.760586,100.401071c23.011575,13.43016,92.927235,11.470796,80.748659,45.07803-20.769684,57.314699-107.56676,28.154064-159.641028,20.490012-63.418102-9.333576-87.982399-26.344666-135.509244-55.32304-16.857656-10.278555-35.484888-18.599492-51.048007-30.052018-14.029983-10.324335-24.884098-23.547639-42.694699-30.735022-32.915602-13.282934-81.457256-4.09275-112.305611,8.87901-107.102691,45.03677-54.968135,97.087033,39.91026,113.37808c52.629079,9.03665,163.631469-6.14701,185.91444,89.462991" opacity="0.2" fill="none" stroke="url(#eWSLi8rbaTl4-stroke)" stroke-width="20" stroke-linecap="round" stroke-dasharray="0.01,500"/>
  <path id="eWSLi8rbaTl5" d="M26.29082,129.844858c0-15.465818,7.021983-31.880026,10.209597-47.127034c3.675859-17.58235-1.283208-51.871363,15.778476-65.56805c7.254969-5.824098,10.187693-4.438835,21.347344-4.781003c44.095413-1.352034,75.299062,40.167369,79.82052,67.617046c1.684616,10.227286-7.824934,56.033877,0,59.421039c46.395702,20.083237,166.202722-38.329998,186.557251,28.003022c16.764631,54.633952-138.807219,98.865783-184.700962,120.891082-12.842152,6.163195-58.920516,25.248961-51.048007,41.663027c12.518042,26.099919,135.02659,10.700867,161.497328.683004c11.657414-4.411755,21.731033-12.191202,30.628802-19.124012c4.358671-3.39612,8.747459-6.772835,12.994036-10.24501c1.034833-.846116,2.481064-3.848227,2.78444-2.731999c2.48778,9.153485-67.929412,74.694531-32.485091,79.911059c27.169751,3.998715,71.619907-44.941691,80.748659-56.006036c41.237613-49.981299,50.820725-106.474792,80.748659-159.139115c9.536583-16.781576,28.861241-53.792314,57.545025-59.421039c39.209864-7.694294,46.88703,27.19233,50.119857,47.81003c2.460285,15.690696,3.503162,32.738444,1.856289,48.493034-2.884946,27.598558-40.408551,109.494404-6.497018,129.770093c12.529584,7.491428,29.336909,7.793429,44.550989,6.147003c65.550531-7.093686,40.139814-69.395391,71.467201-99.035071c10.725607-10.147787,32.654965,15.333999,24.131784,34.150025" fill="none" stroke="url(#eWSLi8rbaTl5-stroke)" stroke-width="4" stroke-linecap="round" stroke-dasharray="0.01,72"/>
    <!-- texts -->
  <g>
    <text x="50%" y="220" class="username" dominant-baseline="middle" text-anchor="middle">
      ${username}
    </text>
    
    <text x="20%" y="320" class="baseTop" dominant-baseline="middle" text-anchor="middle">
        TOP SCORE 
    </text>
    <text x="20%" y="345" class="baseBottom" dominant-baseline="middle" text-anchor="middle">
        ${bestScore}
    </text>

    <text x="50%" y="320" class="baseTop" dominant-baseline="middle" text-anchor="middle">
        TOTAL POINTS 
    </text>
    <text x="50%" y="345" class="baseBottom" dominant-baseline="middle" text-anchor="middle">
        ${totalScore}
    </text>

    <text x="80%" y="320" class="baseTop" dominant-baseline="middle" text-anchor="middle">
        AVG TIME 
    </text>
    <text x="80%" y="345" class="baseBottom" dominant-baseline="middle" text-anchor="middle">
        ${avgTime}
    </text>
	</g>
  <!-- icons -->
  <g transform="translate(55, 255) scale(2,2)" stroke-width="1.5" stroke="#FFE082" fill="none">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
  </g>
  <g transform="translate(175, 255) scale(2,2)" stroke-width="1.5" stroke="#7986CB" fill="none">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </g>
  <g transform="translate(295, 255) scale(2,2)" stroke-width="1.5" stroke="#80CBC4" fill="none">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </g>
  <!-- applogo -->
  <g transform="translate(75, -10) scale(0.025, 0.025)" fill="#f0116a" stroke="none">
      <path d="M5553 7526 c-129 -42 -214 -173 -199 -306 22 -190 211 -307 388 -240 70 26 117 66 153 131 27 48 30 63 30 139 0 91 -10 120 -67 192 -60 76 -206 117 -305 84z"/>
      <path d="M6547 6996 c-63 -31 -103 -69 -135 -131 l-27 -50 -5 -375 c-3 -249 -9 -384 -17 -401 -33 -75 -129 -139 -208 -139 -54 0 -137 40 -167 81 -50 67 -52 76 -58 269 -5 153 -9 191 -24 220 -35 66 -77 109 -134 137 -76 37 -183 40 -253 5 -59 -29 -112 -82 -141 -141 l-23 -46 0 -1480 0 -1480 23 -46 c68 -139 223 -202 364 -149 70 26 117 66 153 131 l30 54 5 940 5 940 24 42 c29 50 91 97 150 113 86 23 188 -23 238 -107 l28 -48 5 -275 5 -275 28 -57 c102 -208 399 -212 512 -7 l30 54 5 385 c6 424 4 412 72 477 142 137 378 32 378 -168 0 -63 38 -147 87 -195 148 -145 401 -89 473 104 20 53 21 70 18 436 -3 373 -3 382 -26 423 -59 112 -142 163 -261 163 -164 -1 -274 -104 -291 -274 -9 -87 -19 -113 -62 -161 -104 -119 -284 -94 -361 50 -21 38 -22 55 -27 420 l-5 380 -27 51 c-31 58 -84 108 -142 135 -62 28 -177 25 -239 -5z"/>
      <path d="M4524 6967 c-89 -30 -163 -105 -190 -194 -12 -38 -14 -206 -14 -952 l0 -906 -24 -52 c-16 -33 -39 -63 -65 -81 -96 -70 -208 -61 -289 21 -66 67 -72 99 -72 386 l0 246 -29 60 c-32 68 -66 103 -131 137 -63 33 -195 33 -257 0 -56 -29 -111 -87 -137 -142 -20 -43 -21 -65 -26 -425 -5 -369 -6 -381 -27 -422 -51 -95 -178 -140 -279 -98 -82 34 -129 103 -139 206 -13 118 -65 204 -157 254 -46 26 -63 30 -133 30 -63 0 -90 -5 -126 -23 -59 -29 -112 -82 -141 -141 -23 -45 -23 -51 -23 -436 l0 -390 28 -57 c48 -98 145 -158 255 -158 83 0 147 26 208 86 57 55 84 120 84 199 0 25 11 62 28 96 87 171 307 171 395 0 l27 -55 0 -351 c0 -405 3 -422 75 -503 80 -88 181 -118 296 -86 53 15 73 27 120 73 88 89 89 93 89 505 0 350 0 351 24 403 41 87 140 142 231 128 62 -9 128 -55 162 -112 27 -47 28 -52 33 -233 5 -182 6 -186 35 -239 114 -207 418 -196 519 19 l21 45 0 1480 0 1480 -23 46 c-29 59 -83 113 -139 140 -55 26 -153 34 -209 16z"/>
      <path d="M4523 3256 c-208 -68 -268 -329 -111 -485 133 -131 361 -96 454 71 26 47 29 62 29 138 0 96 -18 143 -79 203 -72 72 -199 104 -293 73z"/>
  </g>
</svg>
`
)}