/**
 * SentinelBorder AI - Asset & Document Generator
 * High-fidelity synthetic documents, security guilloche patterns, stamps, portraits, and test scenarios.
 */

const AssetGenerator = {
  // Generates realistic portrait faces using canvas vector/gradient composition
  createPortrait(gender = 'M', skinTone = '#f5cba7', hairColor = '#2c3e50', glasses = false, facialHair = false, seed = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Background (Passport standard light grey/blue)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 300);
    bgGrad.addColorStop(0, '#e2e8f0');
    bgGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 240, 300);

    // Subtle backdrop vignette
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, 232, 292);

    // Shoulders / Clothes
    ctx.fillStyle = seed % 2 === 0 ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.ellipse(120, 310, 95, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Collar / shirt
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(95, 230);
    ctx.lineTo(120, 260);
    ctx.lineTo(145, 230);
    ctx.closePath();
    ctx.fill();

    // Neck
    ctx.fillStyle = skinTone;
    ctx.fillRect(104, 180, 32, 50);

    // Head base
    ctx.beginPath();
    ctx.ellipse(120, 140, 48, 62, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.ellipse(70, 142, 8, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(170, 142, 8, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = hairColor;
    if (gender === 'F') {
      ctx.beginPath();
      ctx.arc(120, 125, 52, Math.PI * 0.8, Math.PI * 2.2);
      ctx.lineTo(178, 220);
      ctx.lineTo(165, 220);
      ctx.lineTo(162, 160);
      ctx.lineTo(78, 160);
      ctx.lineTo(75, 220);
      ctx.lineTo(62, 220);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(120, 122, 50, Math.PI * 0.85, Math.PI * 2.15);
      ctx.lineTo(168, 135);
      ctx.lineTo(160, 105);
      ctx.lineTo(80, 105);
      ctx.lineTo(72, 135);
      ctx.closePath();
      ctx.fill();
    }

    // Eyebrows
    ctx.fillStyle = hairColor;
    ctx.fillRect(92, 118, 22, 4);
    ctx.fillRect(126, 118, 22, 4);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(103, 128, 8, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(137, 128, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Irises
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.arc(103, 128, 4, 0, Math.PI * 2);
    ctx.arc(137, 128, 4, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = '#b88c68';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(120, 128);
    ctx.lineTo(120, 152);
    ctx.lineTo(126, 155);
    ctx.stroke();

    // Lips
    ctx.strokeStyle = '#c57d76';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(108, 172);
    ctx.quadraticCurveTo(120, 176, 132, 172);
    ctx.stroke();

    // Glasses option
    if (glasses) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.strokeRect(92, 120, 22, 16);
      ctx.strokeRect(126, 120, 22, 16);
      ctx.beginPath();
      ctx.moveTo(114, 128);
      ctx.lineTo(126, 128);
      ctx.moveTo(92, 128);
      ctx.lineTo(74, 126);
      ctx.moveTo(148, 128);
      ctx.lineTo(166, 126);
      ctx.stroke();
    }

    // Facial hair
    if (facialHair) {
      ctx.fillStyle = hairColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(120, 165, 24, 0, Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      landmarks: [
        { x: 103, y: 128, label: 'Left Eye' },
        { x: 137, y: 128, label: 'Right Eye' },
        { x: 120, y: 152, label: 'Nose Tip' },
        { x: 108, y: 172, label: 'Mouth Left' },
        { x: 132, y: 172, label: 'Mouth Right' },
        { x: 120, y: 198, label: 'Chin Base' }
      ]
    };
  },

  // Generates security guilloche background pattern for official travel documents
  drawGuilloche(ctx, width, height, color = 'rgba(56, 189, 248, 0.12)') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.75;
    const step = 20;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      for (let y = 0; y < height; y += 4) {
        const sinVal = Math.sin(y * 0.04 + x * 0.03) * 14;
        const cosVal = Math.cos(y * 0.02) * 8;
        if (y === 0) ctx.moveTo(x + sinVal + cosVal, y);
        else ctx.lineTo(x + sinVal + cosVal, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  },

  // Draws Ashok Stambh / National Emblem motif
  drawEmblem(ctx, x, y, size = 30) {
    ctx.save();
    ctx.strokeStyle = '#0284c7';
    ctx.fillStyle = '#0369a1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI * 2) / 24;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * (size - 3), y + Math.sin(angle) * (size - 3));
      ctx.stroke();
    }
    ctx.restore();
  },

  // Generate Passport Document Canvas
  createPassportCanvas(opts) {
    const {
      country = 'REPUBLIC OF INDIA / BHARAT',
      countryCode = 'IND',
      docType = 'P',
      passportNo = 'Z4892104',
      surname = 'SHARMA',
      givenNames = 'ADITYA',
      nationality = 'INDIAN',
      dob = '14/05/1992',
      sex = 'M',
      placeOfBirth = 'NEW DELHI',
      placeOfIssue = 'DELHI',
      doi = '13/08/2022',
      doe = '12/08/2032',
      portraitData,
      mrzLine1,
      mrzLine2,
      tamperType = 'none'
    } = opts;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    // Document Base
    const baseGrad = ctx.createLinearGradient(0, 0, 800, 540);
    baseGrad.addColorStop(0, '#f8fafc');
    baseGrad.addColorStop(0.5, '#f1f5f9');
    baseGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 800, 540);

    // Guilloche Security Lines
    this.drawGuilloche(ctx, 800, 540, 'rgba(14, 165, 233, 0.15)');
    this.drawGuilloche(ctx, 800, 540, 'rgba(234, 88, 12, 0.08)');

    // Header Band
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 54);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px "Courier New", monospace, sans-serif';
    ctx.fillText(country.toUpperCase(), 30, 32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`PASSPORT / PASSEPORT`, 600, 32);

    this.drawEmblem(ctx, 550, 30, 16);

    // Photo Box
    const photoX = 40;
    const photoY = 78;
    const photoW = 190;
    const photoH = 240;

    // Draw portrait directly from canvas source for 100% offline instant rendering
    const portraitSource = portraitData.canvas || portraitData;
    ctx.drawImage(portraitSource, photoX, photoY, photoW, photoH);

    // Ghost portrait
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.drawImage(portraitSource, 640, 95, 110, 140);
    ctx.restore();

    // Tampering Simulation 1: Photo Replacement
    if (tamperType === 'photo') {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 3;
      ctx.strokeRect(photoX - 1, photoY - 1, photoW + 2, photoH + 2);

      ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
      ctx.fillRect(photoX + 130, photoY + 180, 50, 45);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(photoX + 5, photoY + 235, 180, 4);
      ctx.restore();
    } else {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(photoX, photoY, photoW, photoH);
    }

    const drawField = (label, val, x, y, isAltered = false) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(label.toUpperCase(), x, y);

      if (isAltered) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y + 2, 140, 19);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 15px Arial';
        ctx.fillText(val, x, y + 16);
        ctx.restore();
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillText(val, x, y + 16);
      }
    };

    const startX = 260;
    drawField('Type / Type', docType, startX, 85);
    drawField('Country Code', countryCode, startX + 110, 85);
    drawField('Passport No.', passportNo, startX + 260, 85);

    drawField('Surname / Nom', surname, startX, 130);
    drawField('Given Names / Prénoms', givenNames, startX, 175);
    drawField('Nationality / Nationalité', nationality, startX, 220);

    const isDobAltered = tamperType === 'dob';
    drawField('Date of Birth / Date de Naissance', dob, startX, 265, isDobAltered);
    drawField('Sex / Sexe', sex, startX + 260, 265);

    drawField('Place of Birth / Lieu de Naissance', placeOfBirth, startX, 310);
    drawField('Date of Issue / Date de Délivrance', doi, startX, 355);
    drawField('Date of Expiry / Date d\'Expiration', doe, startX + 260, 355);

    // Signature Box
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(photoX, 335, photoW, 45);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.fillText('HOLDER SIGNATURE / SIGNATURE DU TITULAIRE', photoX + 6, 347);

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(photoX + 20, 368);
    ctx.bezierCurveTo(photoX + 50, 355, photoX + 70, 375, photoX + 110, 362);
    ctx.bezierCurveTo(photoX + 130, 350, photoX + 150, 370, photoX + 175, 365);
    ctx.stroke();

    // Security Hologram Emblem on right
    ctx.save();
    const holoGrad = ctx.createLinearGradient(650, 280, 750, 380);
    holoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    holoGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.4)');
    holoGrad.addColorStop(1, 'rgba(236, 72, 153, 0.4)');
    ctx.fillStyle = holoGrad;
    ctx.beginPath();
    ctx.arc(700, 330, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.stroke();
    ctx.restore();

    // MRZ (Machine Readable Zone)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 420, 800, 120);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText(mrzLine1, 35, 465);
    ctx.fillText(mrzLine2, 35, 508);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92)
    };
  },

  // Generate Visa Page with Rubber Stamps
  createVisaCanvas(opts) {
    const {
      visaNo = 'V9812401',
      visaType = 'SCHENGEN TYPE C (TOURIST)',
      holderName = 'PATEL, RAJESH',
      passportNo = 'L4091283',
      validFrom = '01/09/2026',
      validUntil = '30/09/2026',
      durationDays = '90',
      entries = '01 (SINGLE)',
      portraitData,
      tamperType = 'stamp'
    } = opts;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');

    // Background paper
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(0, 0, 800, 540);
    this.drawGuilloche(ctx, 800, 540, 'rgba(168, 85, 247, 0.12)');

    // Header
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 800, 50);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('SCHENGEN VISA / VISA SCHENGEN', 30, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px sans-serif';
    ctx.fillText(`NUMBER: ${visaNo}`, 600, 32);

    // Photo
    if (portraitData) {
      const portraitSource = portraitData.canvas || portraitData;
      ctx.drawImage(portraitSource, 40, 75, 170, 220);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(40, 75, 170, 220);
    }

    const drawField = (label, val, x, y) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(label.toUpperCase(), x, y);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(val, x, y + 16);
    };

    drawField('Valid For / Valable Pour', 'ETATS SCHENGEN', 240, 85);
    drawField('From / Du', validFrom, 240, 130);
    drawField('Until / Au', validUntil, 420, 130);
    drawField('Type of Visa', visaType, 240, 175);
    drawField('Number of Entries', entries, 420, 175);
    drawField('Duration of Stay (Days)', `${durationDays} DAYS`, 240, 220);
    drawField('Passport Number', passportNo, 420, 220);
    drawField('Name / Nom', holderName, 240, 265);

    // Stamp Simulation
    const stampX = 580;
    const stampY = 270;

    if (tamperType === 'stamp') {
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.18);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 48, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeRect(-60, -32, 120, 64);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BUNDESPOLIZEI DE', 0, -14);
      ctx.font = 'bold 14px monospace';
      ctx.fillText('02.09.2026', 0, 4);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('FRANKFURT (MAIN)', 0, 20);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fillText('02.09.2026', 2, 6);
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.08);
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-65, -35, 130, 70);
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BORDER POLICE - DELHI', 0, -15);
      ctx.font = 'bold 13px monospace';
      ctx.fillText('IMMIGRATION 01', 0, 5);
      ctx.font = 'bold 10px monospace';
      ctx.fillText('ENTRY 14.08.2026', 0, 22);
      ctx.restore();
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 420, 800, 120);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillText(`VN${visaNo}<<IND<<<<<<<<<<<<<<<<<<`, 35, 465);
    ctx.fillText(`PATEL<<RAJESH<<<<<<<<<<<<<<<<<<<`, 35, 508);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92)
    };
  },

  // Setup 6 preloaded evaluation scenarios
  initDemoScenarios() {
    // Passenger A: Aditya Sharma (Real & Authentic)
    const portraitAditya = this.createPortrait('M', '#f5cba7', '#1e293b', false, true, 1);
    const livePassengerAditya = this.createPortrait('M', '#f5cba7', '#1e293b', false, true, 1);

    const doc1 = this.createPassportCanvas({
      country: 'REPUBLIC OF INDIA / BHARAT',
      countryCode: 'IND',
      docType: 'P',
      passportNo: 'Z4892104',
      surname: 'SHARMA',
      givenNames: 'ADITYA',
      nationality: 'INDIAN',
      dob: '14/05/1992',
      sex: 'M',
      placeOfBirth: 'NEW DELHI',
      placeOfIssue: 'DELHI',
      doi: '13/08/2022',
      doe: '12/08/2032',
      portraitData: portraitAditya,
      mrzLine1: 'P<INDSHARMA<<ADITYA<<<<<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'Z4892104<7IND9205141M3208128<<<<<<<<<<<<<<06',
      tamperType: 'none'
    });

    // Passenger B: Vikram Singh (DOB Altered)
    const portraitVikram = this.createPortrait('M', '#e0ac69', '#111827', true, false, 2);
    const livePassengerVikram = this.createPortrait('M', '#e0ac69', '#111827', true, false, 2);

    const doc2 = this.createPassportCanvas({
      country: 'REPUBLIC OF INDIA / BHARAT',
      countryCode: 'IND',
      docType: 'P',
      passportNo: 'M7102948',
      surname: 'SINGH',
      givenNames: 'VIKRAM',
      nationality: 'INDIAN',
      dob: '19/11/1998', // Visual tampered to 1998
      sex: 'M',
      placeOfBirth: 'CHANDIGARH',
      placeOfIssue: 'CHANDIGARH',
      doi: '10/01/2021',
      doe: '09/01/2031',
      portraitData: portraitVikram,
      mrzLine1: 'P<INDSINGH<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'M7102948<3IND8511191M3101098<<<<<<<<<<<<<<02', // Encrypted 1985
      tamperType: 'dob'
    });

    // Passenger C: Photo Replaced UK Passport (David Miller)
    const splicedIntruderPortrait = this.createPortrait('M', '#e0ac69', '#0f172a', false, true, 4);
    const livePassengerIntruder = splicedIntruderPortrait;

    const doc3 = this.createPassportCanvas({
      country: 'UNITED KINGDOM OF GREAT BRITAIN',
      countryCode: 'GBR',
      docType: 'P',
      passportNo: '539281048',
      surname: 'MILLER',
      givenNames: 'DAVID JOHN',
      nationality: 'BRITISH CITIZEN',
      dob: '22/04/1988',
      sex: 'M',
      placeOfBirth: 'LONDON',
      placeOfIssue: 'IPS',
      doi: '15/06/2020',
      doe: '14/06/2030',
      portraitData: splicedIntruderPortrait,
      mrzLine1: 'P<GBRMILLER<<DAVID<JOHN<<<<<<<<<<<<<<<<<<<<<',
      mrzLine2: '5392810482GBR8804226M3006140<<<<<<<<<<<<<<04',
      tamperType: 'photo'
    });

    // Passenger D: Rajesh Patel (Forged Visa Stamp)
    const portraitPatel = this.createPortrait('M', '#f5cba7', '#374151', true, true, 5);
    const livePassengerPatel = portraitPatel;

    const doc4 = this.createVisaCanvas({
      visaNo: 'V9812401',
      visaType: 'SCHENGEN TYPE C (TOURIST)',
      holderName: 'PATEL, RAJESH',
      passportNo: 'L4091283',
      validFrom: '01/09/2026',
      validUntil: '30/09/2026',
      durationDays: '90',
      entries: '01 (SINGLE)',
      portraitData: portraitPatel,
      tamperType: 'stamp'
    });

    // Passenger E: Identity Impersonator (Sarah Jenkins stolen passport)
    const portraitSarahRealOwner = this.createPortrait('F', '#ffdfba', '#b45309', false, false, 6);
    const impersonatorLookalike = this.createPortrait('F', '#d1d5db', '#1f2937', true, false, 7);

    const doc5 = this.createPassportCanvas({
      country: 'CANADA / CANADA',
      countryCode: 'CAN',
      docType: 'P',
      passportNo: 'CE892103',
      surname: 'JENKINS',
      givenNames: 'SARAH EMILY',
      nationality: 'CANADIAN',
      dob: '08/11/1995',
      sex: 'F',
      placeOfBirth: 'TORONTO',
      placeOfIssue: 'OTTAWA',
      doi: '04/03/2022',
      doe: '03/03/2032',
      portraitData: portraitSarahRealOwner,
      mrzLine1: 'P<CANJENKINS<<SARAH<EMILY<<<<<<<<<<<<<<<<<<<',
      mrzLine2: 'CE892103<1CAN9511084F3203038<<<<<<<<<<<<<<08',
      tamperType: 'none'
    });

    // Passenger F: Interpol Watchlist Hit (Carlos Mendez)
    const portraitCarlos = this.createPortrait('M', '#cd853f', '#0f172a', false, true, 8);
    const livePassengerCarlos = portraitCarlos;

    const doc6 = this.createPassportCanvas({
      country: 'REPUBLICA BOLIVARIANA DE VENEZUELA',
      countryCode: 'VEN',
      docType: 'P',
      passportNo: 'P10928374',
      surname: 'MENDEZ',
      givenNames: 'CARLOS ENRIQUE',
      nationality: 'VENEZUELAN',
      dob: '03/07/1979',
      sex: 'M',
      placeOfBirth: 'CARACAS',
      placeOfIssue: 'SAIME',
      doi: '12/04/2011',
      doe: '11/04/2021', // EXPIRED!
      portraitData: portraitCarlos,
      mrzLine1: 'P<VENMENDEZ<<CARLOS<ENRIQUE<<<<<<<<<<<<<<<<<',
      mrzLine2: 'P109283748VEN7907031M2104115<<<<<<<<<<<<<<02',
      tamperType: 'none'
    });

    return [
      {
        id: 'scenario-1',
        staticDocPath: './01_PASS_Passport_Aditya_Sharma_Clean.png',
        title: 'Authentic Indian Passport',
        subtitle: 'Aditya Sharma (Clear Border Clearance)',
        badge: 'AUTHENTIC',
        badgeClass: 'badge-success',
        docType: 'Passport',
        docImg: doc1.dataUrl,
        docCanvas: doc1.canvas,
        portraitImg: portraitAditya.dataUrl,
        liveImg: livePassengerAditya.dataUrl,
        rawMeta: {
          software: 'National Printing Press / Machine Engraved',
          camera: 'Certified Studio System 600DPI',
          dpi: '600 DPI',
          colorSpace: 'sRGB IEC61966-2.1',
          compression: 'Baseline Standard'
        },
        ocr: {
          docType: 'P',
          countryCode: 'IND',
          passportNo: 'Z4892104',
          name: 'ADITYA SHARMA',
          surname: 'SHARMA',
          givenNames: 'ADITYA',
          nationality: 'INDIAN',
          dob: '14/05/1992',
          sex: 'M',
          doi: '13/08/2022',
          doe: '12/08/2032',
          mrzLine1: 'P<INDSHARMA<<ADITYA<<<<<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'Z4892104<7IND9205141M3208128<<<<<<<<<<<<<<06'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 4.2,
          textManipulated: false,
          fontMismatchScore: 2.1,
          stampForged: false,
          stampAnomalyScore: 1.8,
          exifAnomaly: false,
          elaPeakDelta: 12.4
        },
        biometrics: {
          matchScore: 98.4,
          distance: 0.12,
          livenessVerified: true,
          antiSpoofingScore: 99.1
        },
        watchlistStatus: 'CLEAR'
      },
      {
        id: 'scenario-2',
        staticDocPath: './02_FAIL_Passport_Viktor_Tampered_Photo.png',
        title: 'Altered Date of Birth',
        subtitle: 'Vikram Singh (Text Manipulation & Checksum Mismatch)',
        badge: 'TEXT TAMPERED',
        badgeClass: 'badge-danger',
        docType: 'Passport',
        docImg: doc2.dataUrl,
        docCanvas: doc2.canvas,
        portraitImg: portraitVikram.dataUrl,
        liveImg: livePassengerVikram.dataUrl,
        rawMeta: {
          software: 'Paint.NET v4.3.11 / Modified Re-save',
          camera: 'Unknown Digital Flatbed Scanner',
          dpi: '300 DPI',
          colorSpace: 'sRGB',
          compression: 'Subsampled Chroma 4:2:0'
        },
        ocr: {
          docType: 'P',
          countryCode: 'IND',
          passportNo: 'M7102948',
          name: 'VIKRAM SINGH',
          surname: 'SINGH',
          givenNames: 'VIKRAM',
          nationality: 'INDIAN',
          dob: '19/11/1998',
          sex: 'M',
          doi: '10/01/2021',
          doe: '09/01/2031',
          mrzLine1: 'P<INDSINGH<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'M7102948<3IND8511191M3101098<<<<<<<<<<<<<<02'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 6.8,
          textManipulated: true,
          fontMismatchScore: 91.4,
          stampForged: false,
          stampAnomalyScore: 3.1,
          exifAnomaly: true,
          elaPeakDelta: 86.7
        },
        biometrics: {
          matchScore: 96.8,
          distance: 0.14,
          livenessVerified: true,
          antiSpoofingScore: 98.5
        },
        watchlistStatus: 'CLEAR'
      },
      {
        id: 'scenario-3',
        staticDocPath: './03_FAIL_Passport_Elena_Altered_DOB.png',
        title: 'Photo Spliced UK Passport',
        subtitle: 'David Miller (Photo Replacement & EXIF Fraud Tag)',
        badge: 'PHOTO REPLACED',
        badgeClass: 'badge-danger',
        docType: 'Passport',
        docImg: doc3.dataUrl,
        docCanvas: doc3.canvas,
        portraitImg: splicedIntruderPortrait.dataUrl,
        liveImg: livePassengerIntruder.dataUrl,
        rawMeta: {
          software: 'Adobe Photoshop 24.1 (Windows) [FRAUD TAG]',
          camera: 'Software Splicer Synthetic',
          dpi: '300 DPI',
          colorSpace: 'Adobe RGB (1998) [Mismatch]',
          compression: 'Recompressed 2 passes'
        },
        ocr: {
          docType: 'P',
          countryCode: 'GBR',
          passportNo: '539281048',
          name: 'DAVID JOHN MILLER',
          surname: 'MILLER',
          givenNames: 'DAVID JOHN',
          nationality: 'BRITISH CITIZEN',
          dob: '22/04/1988',
          sex: 'M',
          doi: '15/06/2020',
          doe: '14/06/2030',
          mrzLine1: 'P<GBRMILLER<<DAVID<JOHN<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: '5392810482GBR8804226M3006140<<<<<<<<<<<<<<04'
        },
        tamperProfile: {
          photoReplaced: true,
          photoSeamScore: 96.2,
          textManipulated: false,
          fontMismatchScore: 8.5,
          stampForged: false,
          stampAnomalyScore: 4.2,
          exifAnomaly: true,
          elaPeakDelta: 94.8
        },
        biometrics: {
          matchScore: 97.2,
          distance: 0.11,
          livenessVerified: true,
          antiSpoofingScore: 98.9
        },
        watchlistStatus: 'CLEAR'
      },
      {
        id: 'scenario-4',
        staticDocPath: './04_FAIL_Visa_Rajesh_Forged_Stamp.png',
        title: 'Forged Schengen Visa Stamp',
        subtitle: 'Rajesh Patel (Rubber Stamp Pigment & Stay Alteration)',
        badge: 'FORGED STAMP',
        badgeClass: 'badge-warning',
        docType: 'Visa',
        docImg: doc4.dataUrl,
        docCanvas: doc4.canvas,
        portraitImg: portraitPatel.dataUrl,
        liveImg: livePassengerPatel.dataUrl,
        rawMeta: {
          software: 'GIMP 2.10.32 Image Manipulation [ALERT]',
          camera: 'Flatbed Scanner V39',
          dpi: '300 DPI',
          colorSpace: 'sRGB',
          compression: 'Standard'
        },
        ocr: {
          docType: 'VN',
          countryCode: 'IND',
          passportNo: 'L4091283',
          visaNo: 'V9812401',
          name: 'RAJESH PATEL',
          visaType: 'SCHENGEN TYPE C (TOURIST)',
          validFrom: '01/09/2026',
          validUntil: '30/09/2026',
          duration: '90 DAYS (Altered)',
          mrzLine1: 'VN9812401<<IND<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'PATEL<<RAJESH<<<<<<<<<<<<<<<<<<<'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 9.3,
          textManipulated: true,
          fontMismatchScore: 68.2,
          stampForged: true,
          stampAnomalyScore: 94.5,
          exifAnomaly: true,
          elaPeakDelta: 88.3
        },
        biometrics: {
          matchScore: 95.1,
          distance: 0.16,
          livenessVerified: true,
          antiSpoofingScore: 97.4
        },
        watchlistStatus: 'CLEAR'
      },
      {
        id: 'scenario-5',
        title: 'Identity Impersonation',
        subtitle: 'Sarah Jenkins (Valid Document, Biometric Face Mismatch)',
        badge: 'FACE MISMATCH',
        badgeClass: 'badge-danger',
        docType: 'Passport',
        docImg: doc5.dataUrl,
        docCanvas: doc5.canvas,
        portraitImg: portraitSarahRealOwner.dataUrl,
        liveImg: impersonatorLookalike.dataUrl,
        rawMeta: {
          software: 'Canadian Passport Order - Government Issue',
          camera: 'Certified Border Enrolment System',
          dpi: '600 DPI',
          colorSpace: 'sRGB IEC61966-2.1',
          compression: 'Lossless Official'
        },
        ocr: {
          docType: 'P',
          countryCode: 'CAN',
          passportNo: 'CE892103',
          name: 'SARAH EMILY JENKINS',
          surname: 'JENKINS',
          givenNames: 'SARAH EMILY',
          nationality: 'CANADIAN',
          dob: '08/11/1995',
          sex: 'F',
          doi: '04/03/2022',
          doe: '03/03/2032',
          mrzLine1: 'P<CANJENKINS<<SARAH<EMILY<<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'CE892103<1CAN9511084F3203038<<<<<<<<<<<<<<08'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 3.8,
          textManipulated: false,
          fontMismatchScore: 1.9,
          stampForged: false,
          stampAnomalyScore: 2.1,
          exifAnomaly: false,
          elaPeakDelta: 9.6
        },
        biometrics: {
          matchScore: 31.8, // CRITICAL FAILURE: Face does not match passport portrait!
          distance: 0.78,
          livenessVerified: true,
          antiSpoofingScore: 96.1
        },
        watchlistStatus: 'CLEAR'
      },
      {
        id: 'scenario-6',
        staticDocPath: './05_FAIL_Passport_Carlos_Interpol_Hit.png',
        title: 'Interpol Watchlist & Expired Doc',
        subtitle: 'Carlos Mendez (Red Notice Match & Expired Passport)',
        badge: 'INTERPOL HIT',
        badgeClass: 'badge-critical',
        docType: 'Passport',
        docImg: doc6.dataUrl,
        docCanvas: doc6.canvas,
        portraitImg: portraitCarlos.dataUrl,
        liveImg: livePassengerCarlos.dataUrl,
        rawMeta: {
          software: 'SAIME Venezuela Travel Authority',
          camera: 'Official Capture System 2011',
          dpi: '400 DPI',
          colorSpace: 'sRGB',
          compression: 'Baseline'
        },
        ocr: {
          docType: 'P',
          countryCode: 'VEN',
          passportNo: 'P10928374',
          name: 'CARLOS ENRIQUE MENDEZ',
          surname: 'MENDEZ',
          givenNames: 'CARLOS ENRIQUE',
          nationality: 'VENEZUELAN',
          dob: '03/07/1979',
          sex: 'M',
          doi: '12/04/2011',
          doe: '11/04/2021', // Expired
          mrzLine1: 'P<VENMENDEZ<<CARLOS<ENRIQUE<<<<<<<<<<<<<<<<<',
          mrzLine2: 'P109283748VEN7907031M2104115<<<<<<<<<<<<<<02'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 5.2,
          textManipulated: false,
          fontMismatchScore: 4.1,
          stampForged: false,
          stampAnomalyScore: 3.5,
          exifAnomaly: false,
          elaPeakDelta: 14.1
        },
        biometrics: {
          matchScore: 97.5,
          distance: 0.11,
          livenessVerified: true,
          antiSpoofingScore: 98.2
        },
        watchlistStatus: 'INTERPOL_RED_NOTICE' // Active fugitive match
      }
    ];
  }
};
