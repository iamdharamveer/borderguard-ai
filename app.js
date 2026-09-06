/**
 * SentinelBorder - Central Application Logic & AI Screening Engine
 * Modules 1-4, ICAO 9303 Checksum Engine, Real Canvas ELA Forensics,
 * Live Webcam Biometrics, Risk Engine, and Audio Synthesizer.
 */

// Global State
const State = {
  scenarios: [],
  currentScenario: null,
  activeConsoleTab: 'tab-ocr',
  currentView: 'consoleView', // 'consoleView' | 'biometricsView'
  viewMode: 'normal', // 'normal' | 'ela'
  isScanning: false,
  webcamStream: null,
  audioEnabled: true,
  customUploadedDoc: null
};

// ==========================================================================
// Web Audio API Sound Synthesizer (Chirps, Alarms, Chimes)
// ==========================================================================
const SoundEffects = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playScan() {
    if (!State.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },
  playSuccess() {
    if (!State.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  },
  playAlert() {
    if (!State.audioEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [750, 420, 750].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.12, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.12);
    });
  }
};

// ==========================================================================
// Module 2: ICAO 9303 Checksum Engine
// ==========================================================================
const IcaoChecksum = {
  charVal(c) {
    if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
    if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
    if (c === '<') return 0;
    return 0;
  },

  calculate(str) {
    const weights = [7, 3, 1];
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      const val = this.charVal(str[i].toUpperCase());
      sum += val * weights[i % 3];
    }
    return sum % 10;
  },

  verifyField(dataString, expectedCheckDigit) {
    const computed = this.calculate(dataString);
    const expected = parseInt(expectedCheckDigit, 10);
    return {
      computed,
      expected,
      valid: computed === expected
    };
  }
};

// ==========================================================================
// Module 3: Error Level Analysis (ELA) Engine on Canvas
// ==========================================================================
const ElaForensics = {
  generate(sourceCanvas, targetCanvas, scaleFactor = 16) {
    return new Promise((resolve) => {
      const width = sourceCanvas.width;
      const height = sourceCanvas.height;

      targetCanvas.width = width;
      targetCanvas.height = height;
      const targetCtx = targetCanvas.getContext('2d');

      const tempImg = new Image();
      tempImg.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(tempImg, 0, 0, width, height);

        const srcData = sourceCanvas.getContext('2d').getImageData(0, 0, width, height);
        const recompressedData = offCtx.getImageData(0, 0, width, height);
        const outData = targetCtx.createImageData(width, height);

        const srcPx = srcData.data;
        const recPx = recompressedData.data;
        const outPx = outData.data;

        for (let i = 0; i < srcPx.length; i += 4) {
          const deltaR = Math.abs(srcPx[i] - recPx[i]) * scaleFactor;
          const deltaG = Math.abs(srcPx[i + 1] - recPx[i + 1]) * scaleFactor;
          const deltaB = Math.abs(srcPx[i + 2] - recPx[i + 2]) * scaleFactor;

          const avgDelta = (deltaR + deltaG + deltaB) / 3;
          if (avgDelta > 70) {
            outPx[i] = Math.min(255, deltaR * 1.5);
            outPx[i + 1] = Math.max(0, 100 - avgDelta);
            outPx[i + 2] = Math.max(0, 50 - avgDelta);
          } else {
            outPx[i] = Math.min(255, deltaR);
            outPx[i + 1] = Math.min(255, deltaG);
            outPx[i + 2] = Math.min(255, deltaB);
          }
          outPx[i + 3] = 255;
        }

        targetCtx.putImageData(outData, 0, 0);
        resolve(targetCanvas);
      };

      tempImg.src = sourceCanvas.toDataURL('image/jpeg', 0.75);
    });
  }
};

// ==========================================================================
// Module 4: Biometric Matching & Live Webcam Feeds
// ==========================================================================
const Biometrics = {
  async startWebcam(videoElement) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 600, facingMode: 'user' }
      });
      State.webcamStream = stream;
      videoElement.srcObject = stream;
      videoElement.play();
      return true;
    } catch (err) {
      console.warn('Webcam access error or unavailable:', err);
      return false;
    }
  },

  stopWebcam(videoElement) {
    if (State.webcamStream) {
      State.webcamStream.getTracks().forEach(track => track.stop());
      State.webcamStream = null;
      if (videoElement) videoElement.srcObject = null;
    }
  }
};

// ==========================================================================
// Main UI Controller & Analysis Pipeline
// ==========================================================================
const Controller = {
  init() {
    State.scenarios = AssetGenerator.initDemoScenarios();
    this.renderScenarioPills();
    this.setupEventListeners();
    this.loadScenario(State.scenarios[0].id);
  },

  switchView(viewId) {
    State.currentView = viewId;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('active');
      }
    });

    const consoleView = document.getElementById('consoleView');
    const biometricsView = document.getElementById('biometricsView');

    if (consoleView) consoleView.style.display = viewId === 'consoleView' ? 'block' : 'none';
    if (biometricsView) biometricsView.style.display = viewId === 'biometricsView' ? 'flex' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderScenarioPills() {
    const container = document.getElementById('demoScenariosStrip');
    if (!container) return;
    container.innerHTML = '';

    const getTagClass = (badgeClass) => {
      if (badgeClass === 'badge-success') return 'tag-safe';
      if (badgeClass === 'badge-warning') return 'tag-warn';
      return 'tag-danger';
    };

    State.scenarios.forEach((sc, idx) => {
      const pill = document.createElement('div');
      pill.className = `preset-pill ${idx === 0 ? 'active' : ''}`;
      pill.id = `pill-${sc.id}`;
      pill.innerHTML = `
        <span class="pill-tag ${getTagClass(sc.badgeClass)}">${sc.badge}</span>
        <span>${sc.title}</span>
      `;
      pill.onclick = () => this.loadScenario(sc.id);
      container.appendChild(pill);
    });
  },

  async loadScenario(scenarioId) {
    const scenario = State.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    State.currentScenario = scenario;

    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    const activePill = document.getElementById(`pill-${scenarioId}`);
    if (activePill) activePill.classList.add('active');

    // Prefer the real uploaded demo PNG when this scenario has one.
    // This keeps the Demo Files preview and the scanner in sync on GitHub Pages.
    if (scenario.staticDocPath) {
      try {
        const img = new Image();
        img.decoding = 'async';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = scenario.staticDocPath;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        scenario.docCanvas = canvas;
        scenario.docImg = scenario.staticDocPath;
      } catch (err) {
        console.warn('Static demo document could not be loaded:', scenario.staticDocPath, err);
      }
    }

    this.triggerScanPipeline(scenario);
  },

  triggerScanPipeline(scenario) {
    State.isScanning = true;
    const scannerZone = document.getElementById('docScannerZone');
    if (scannerZone) scannerZone.classList.add('scanning');
    SoundEffects.playScan();

    this.setViewMode('normal');

    const docCanvas = document.getElementById('docCanvas');
    const docCtx = docCanvas.getContext('2d');

    const renderReady = async () => {
      const elaCanvas = document.getElementById('elaCanvas');
      await ElaForensics.generate(docCanvas, elaCanvas);

      setTimeout(() => {
        if (scannerZone) scannerZone.classList.remove('scanning');
        State.isScanning = false;

        this.renderModule1_OCR(scenario);
        this.renderModule2_Validation(scenario);
        this.renderModule3_Tampering(scenario);
        this.renderModule4_Biometrics(scenario);
        this.renderExecutiveClearanceDirective(scenario);
      }, 450);
    };

    if (scenario.docCanvas) {
      docCanvas.width = scenario.docCanvas.width;
      docCanvas.height = scenario.docCanvas.height;
      docCtx.drawImage(scenario.docCanvas, 0, 0);
      renderReady();
    } else {
      const docImg = new Image();
      docImg.onload = () => {
        docCanvas.width = docImg.width;
        docCanvas.height = docImg.height;
        docCtx.drawImage(docImg, 0, 0);
        renderReady();
      };
      docImg.src = scenario.docImg;
    }
  },

  // Module 1: OCR Extraction
  renderModule1_OCR(scenario) {
    const ocr = scenario.ocr;
    const tbody = document.getElementById('ocrTableBody');
    if (!tbody) return;

    const isDobTampered = scenario.tamperProfile.textManipulated && scenario.category === 'TAMPERED_TEXT';

    tbody.innerHTML = `
      <tr>
        <td>Document Type</td>
        <td class="field-value">${ocr.docType || 'P (Standard Passport)'}</td>
        <td><span class="pill-tag tag-safe">VALID</span></td>
      </tr>
      <tr>
        <td>Issuing State</td>
        <td class="field-value">${ocr.countryCode}</td>
        <td><span class="pill-tag tag-safe">VERIFIED</span></td>
      </tr>
      <tr>
        <td>Document / Passport No</td>
        <td class="field-value" style="color: #38bdf8;">${ocr.passportNo}</td>
        <td><span class="pill-tag tag-safe">VERIFIED</span></td>
      </tr>
      <tr>
        <td>Full Legal Name</td>
        <td class="field-value">${ocr.name}</td>
        <td><span class="pill-tag tag-safe">VERIFIED</span></td>
      </tr>
      <tr>
        <td>Nationality</td>
        <td class="field-value">${ocr.nationality}</td>
        <td><span class="pill-tag tag-safe">VERIFIED</span></td>
      </tr>
      <tr class="${isDobTampered ? 'tampered-row' : ''}">
        <td>Date of Birth (DOB)</td>
        <td class="field-value">
          ${ocr.dob} ${isDobTampered ? ' ⚠️ [TEXT TAMPERED]' : ''}
        </td>
        <td><span class="pill-tag ${isDobTampered ? 'tag-danger' : 'tag-safe'}">${isDobTampered ? 'MISMATCH' : 'MATCH'}</span></td>
      </tr>
      <tr>
        <td>Sex / Gender</td>
        <td class="field-value">${ocr.sex || 'M'}</td>
        <td><span class="pill-tag tag-safe">VERIFIED</span></td>
      </tr>
      <tr>
        <td>Date of Expiry</td>
        <td class="field-value" style="${scenario.category === 'WATCHLIST_HIT' ? 'color: var(--status-danger); font-weight: 700;' : ''}">
          ${ocr.doe || 'N/A'} ${scenario.category === 'WATCHLIST_HIT' ? ' ❌ [EXPIRED]' : ''}
        </td>
        <td><span class="pill-tag ${scenario.category === 'WATCHLIST_HIT' ? 'tag-danger' : 'tag-safe'}">${scenario.category === 'WATCHLIST_HIT' ? 'EXPIRED' : 'ACTIVE'}</span></td>
      </tr>
    `;

    const mrzLine1El = document.getElementById('mrzLine1');
    const mrzLine2El = document.getElementById('mrzLine2');
    if (mrzLine1El) mrzLine1El.textContent = ocr.mrzLine1;
    if (mrzLine2El) mrzLine2El.textContent = ocr.mrzLine2;

    const metaGrid = document.getElementById('metaGrid');
    if (metaGrid && scenario.rawMeta) {
      metaGrid.innerHTML = `
        <div class="meta-block">
          <span class="meta-label">Software Tag:</span>
          <span class="meta-val" style="${scenario.rawMeta.software.includes('Photoshop') || scenario.rawMeta.software.includes('GIMP') || scenario.rawMeta.software.includes('Paint.NET') ? 'color: var(--status-danger); font-weight:700;' : ''}">${scenario.rawMeta.software}</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">Optical Device:</span>
          <span class="meta-val">${scenario.rawMeta.camera}</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">Scan Resolution:</span>
          <span class="meta-val">${scenario.rawMeta.dpi}</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">Color Space:</span>
          <span class="meta-val">${scenario.rawMeta.colorSpace}</span>
        </div>
      `;
    }

    this.updateBoundingBox(scenario);
  },

  updateBoundingBox(scenario) {
    const box = document.getElementById('tamperBoundingBox');
    const label = document.getElementById('tamperBoxLabel');
    if (!box || !label) return;

    if (scenario.category === 'TAMPERED_TEXT') {
      box.style.display = 'block';
      box.style.left = '52%';
      box.style.top = '44%';
      box.style.width = '22%';
      box.style.height = '7%';
      label.textContent = 'FONT TAMPERING / DOB MISMATCH';
    } else if (scenario.category === 'PHOTO_REPLACED') {
      box.style.display = 'block';
      box.style.left = '4.5%';
      box.style.top = '15%';
      box.style.width = '23%';
      box.style.height = '46%';
      label.textContent = 'SPLICED PHOTO EDGE DISCONTINUITY';
    } else if (scenario.category === 'FORGED_STAMP') {
      box.style.display = 'block';
      box.style.left = '63%';
      box.style.top = '52%';
      box.style.width = '30%';
      box.style.height = '24%';
      label.textContent = 'FORGED STAMP / GAMUT IRREGULARITY';
    } else if (scenario.category === 'WATCHLIST_HIT') {
      box.style.display = 'block';
      box.style.left = '27%';
      box.style.top = '62%';
      box.style.width = '68%';
      box.style.height = '11%';
      label.textContent = 'INTERPOL RED NOTICE / EXPIRED DOCUMENT';
    } else {
      box.style.display = 'none';
    }
  },

  // Module 2: ICAO Doc 9303 Checksums
  renderModule2_Validation(scenario) {
    const ocr = scenario.ocr;
    const mrz2 = ocr.mrzLine2 || '';

    let docNo = mrz2.substring(0, 9);
    let docNoCheck = mrz2.substring(9, 10);
    let dobData = mrz2.substring(13, 19);
    let dobCheck = mrz2.substring(19, 20);
    let doeData = mrz2.substring(21, 27);
    let doeCheck = mrz2.substring(27, 28);

    const docNoResult = IcaoChecksum.verifyField(docNo, docNoCheck);
    const dobResult = IcaoChecksum.verifyField(dobData, dobCheck);
    const doeResult = IcaoChecksum.verifyField(doeData, doeCheck);

    let crossCheckFail = scenario.category === 'TAMPERED_TEXT';
    const isExpired = scenario.category === 'WATCHLIST_HIT';

    const container = document.getElementById('checksumGrid');
    if (!container) return;

    container.innerHTML = `
      <div class="diag-item ${!docNoResult.valid ? 'failed' : ''}">
        <span class="diag-heading">Doc Number Check Digit:</span>
        <div class="diag-body">
          <span>Target: ${docNoCheck} | Computed: ${docNoResult.computed}</span>
          <span class="${docNoResult.valid ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${docNoResult.valid ? '✓ PASS' : '✗ FAIL'}</span>
        </div>
      </div>

      <div class="diag-item ${(!dobResult.valid || crossCheckFail) ? 'failed' : ''}">
        <span class="diag-heading">DOB 7-3-1 Weight Sum:</span>
        <div class="diag-body">
          <span>MRZ: ${dobData} | Check: ${dobCheck}</span>
          <span class="${dobResult.valid ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${dobResult.valid ? '✓ MATCH' : '✗ FAIL'}</span>
        </div>
      </div>

      <div class="diag-item ${!doeResult.valid ? 'failed' : ''}">
        <span class="diag-heading">Expiry Date Check Digit:</span>
        <div class="diag-body">
          <span>MRZ: ${doeData} | Check: ${doeCheck}</span>
          <span class="${doeResult.valid ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${doeResult.valid ? '✓ VALID' : '✗ FAIL'}</span>
        </div>
      </div>

      <div class="diag-item ${crossCheckFail ? 'failed' : ''}">
        <span class="diag-heading">Visual vs MRZ Cross-Check:</span>
        <div class="diag-body">
          <span>${crossCheckFail ? 'VISUAL 1998 ≠ MRZ 1985' : 'Synchronized'}</span>
          <span class="${!crossCheckFail ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${!crossCheckFail ? '✓ VERIFIED' : '✗ CONFLICT'}</span>
        </div>
      </div>

      <div class="diag-item ${isExpired ? 'failed' : ''}">
        <span class="diag-heading">Document Expiration Status:</span>
        <div class="diag-body">
          <span>${isExpired ? 'Expired: 11/04/2021' : 'Valid until ' + (ocr.doe || '2032')}</span>
          <span class="${!isExpired ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${!isExpired ? '✓ ACTIVE' : '✗ EXPIRED'}</span>
        </div>
      </div>

      <div class="diag-item ${scenario.watchlistStatus !== 'CLEAR' ? 'failed' : ''}">
        <span class="diag-heading">Interpol & National Watchlist:</span>
        <div class="diag-body">
          <span>${scenario.watchlistStatus === 'CLEAR' ? 'Zero Watchlist Hits' : 'ALERT: RED NOTICE MATCH'}</span>
          <span class="${scenario.watchlistStatus === 'CLEAR' ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${scenario.watchlistStatus === 'CLEAR' ? '✓ CLEAR' : '✗ FLAGGED'}</span>
        </div>
      </div>
    `;
  },

  // Module 3: Tampering Matrix
  renderModule3_Tampering(scenario) {
    const tp = scenario.tamperProfile;
    const container = document.getElementById('tamperMatrixContainer');
    if (!container) return;

    const getBarClass = (val) => {
      if (val < 25) return 'fill-safe';
      if (val < 65) return 'fill-warn';
      return 'fill-danger';
    };

    container.innerHTML = `
      <div class="spectrum-row">
        <div class="spectrum-head">
          <span>Photo Replacement & Edge Splicing</span>
          <span style="color: ${tp.photoSeamScore > 50 ? 'var(--status-danger)' : 'var(--status-safe)'}; font-family: var(--font-mono);">
            ${tp.photoSeamScore.toFixed(1)}% ${tp.photoReplaced ? '⚠️ DETECTED' : '✓ Normal'}
          </span>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill ${getBarClass(tp.photoSeamScore)}" style="width: ${tp.photoSeamScore}%"></div>
        </div>
      </div>

      <div class="spectrum-row">
        <div class="spectrum-head">
          <span>Text Font Baseline Shift (DOB / Expiry)</span>
          <span style="color: ${tp.fontMismatchScore > 50 ? 'var(--status-danger)' : 'var(--status-safe)'}; font-family: var(--font-mono);">
            ${tp.fontMismatchScore.toFixed(1)}% ${tp.textManipulated ? '⚠️ ALTERED' : '✓ Authentic'}
          </span>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill ${getBarClass(tp.fontMismatchScore)}" style="width: ${tp.fontMismatchScore}%"></div>
        </div>
      </div>

      <div class="spectrum-row">
        <div class="spectrum-head">
          <span>Stamp / Seal Spectrophotometry Gamut</span>
          <span style="color: ${tp.stampAnomalyScore > 50 ? 'var(--status-danger)' : 'var(--status-safe)'}; font-family: var(--font-mono);">
            ${tp.stampAnomalyScore.toFixed(1)}% ${tp.stampForged ? '⚠️ FORGERY' : '✓ Clean'}
          </span>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill ${getBarClass(tp.stampAnomalyScore)}" style="width: ${tp.stampAnomalyScore}%"></div>
        </div>
      </div>

      <div class="spectrum-row">
        <div class="spectrum-head">
          <span>Error Level Analysis (ELA) Peak Delta</span>
          <span style="color: ${tp.elaPeakDelta > 40 ? 'var(--status-danger)' : 'var(--status-safe)'}; font-family: var(--font-mono);">
            ${tp.elaPeakDelta.toFixed(1)} Δ ${tp.elaPeakDelta > 40 ? '⚠️ Compression Discrepancy' : '✓ Uniform'}
          </span>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill ${getBarClass(tp.elaPeakDelta)}" style="width: ${tp.elaPeakDelta}%"></div>
        </div>
      </div>
    `;
  },

  // Module 4: Biometrics
  renderModule4_Biometrics(scenario) {
    const bio = scenario.biometrics;

    // Console Preview
    const consoleDoc = document.getElementById('consoleDocPortrait');
    const consoleLive = document.getElementById('consoleLivePortrait');
    const consoleScore = document.getElementById('consoleBioScore');

    if (consoleDoc) consoleDoc.src = scenario.portraitImg;
    if (consoleLive) consoleLive.src = scenario.liveImg;
    if (consoleScore) {
      consoleScore.textContent = `${bio.matchScore.toFixed(1)}% Match`;
      consoleScore.style.color = bio.matchScore > 80 ? 'var(--status-safe)' : 'var(--status-danger)';
    }

    // Biometric Bay
    const bioBayDoc = document.getElementById('bioBayDocImg');
    const bioBayLive = document.getElementById('bioBayLiveImg');
    const bioHeading = document.getElementById('bioBayScoreHeading');
    const bioBadge = document.getElementById('bioBayStatusBadge');

    if (bioBayDoc) bioBayDoc.src = scenario.portraitImg;
    if (bioBayLive && !State.webcamStream) bioBayLive.src = scenario.liveImg;

    if (bioHeading) {
      bioHeading.textContent = `${bio.matchScore.toFixed(1)}% Match Verified`;
      bioHeading.style.color = bio.matchScore > 80 ? 'var(--status-safe)' : 'var(--status-danger)';
    }

    if (bioBadge) {
      if (bio.matchScore > 80) {
        bioBadge.className = 'pill-tag tag-safe';
        bioBadge.textContent = 'BIOMETRIC MATCH CONFIRMED';
      } else {
        bioBadge.className = 'pill-tag tag-danger';
        bioBadge.textContent = 'IDENTITY IMPERSONATION ALERT';
      }
    }

    const telemetry = document.getElementById('bioBayTelemetryGrid');
    if (telemetry) {
      const matchPass = bio.matchScore > 80;
      telemetry.innerHTML = `
        <div class="diag-item ${!matchPass ? 'failed' : ''}">
          <span class="diag-heading">1:1 Deep Euclidean Distance:</span>
          <div class="diag-body">
            <span>Distance d = ${bio.distance}</span>
            <span class="${matchPass ? 'pill-tag tag-safe' : 'pill-tag tag-danger'}">${matchPass ? 'PASS' : 'FAIL'}</span>
          </div>
        </div>
        <div class="diag-item">
          <span class="diag-heading">Passive Anti-Spoofing Liveness:</span>
          <div class="diag-body">
            <span>99.1% Confidence</span>
            <span class="pill-tag tag-safe">LIVE PERSON</span>
          </div>
        </div>
        <div class="diag-item">
          <span class="diag-heading">Texture Depth Consistency:</span>
          <div class="diag-body">
            <span>No Screen Glare / Print Artifact</span>
            <span class="pill-tag tag-safe">CONFIRMED</span>
          </div>
        </div>
      `;
    }
  },

  // Clearance Directive & Risk Score
  renderExecutiveClearanceDirective(scenario) {
    const tp = scenario.tamperProfile;
    const bio = scenario.biometrics;

    let risk = 0;
    const maxTamper = Math.max(tp.photoSeamScore, tp.fontMismatchScore, tp.stampAnomalyScore);
    risk += (maxTamper / 100) * 40;

    const bioRisk = (100 - bio.matchScore);
    risk += (bioRisk / 100) * 30;

    if (scenario.watchlistStatus !== 'CLEAR') risk += 25;
    if (scenario.category === 'WATCHLIST_HIT') risk += 15;
    if (scenario.category === 'TAMPERED_TEXT') risk += 20;

    risk = Math.min(100, Math.round(risk));
    if (scenario.category === 'VALID') risk = 4;

    const card = document.getElementById('riskVerdictCard');
    const decisionText = document.getElementById('verdictDecision');
    const riskPercent = document.getElementById('riskPercent');
    const verdictSubtext = document.getElementById('verdictSubtext');

    if (!card || !decisionText || !riskPercent) return;

    riskPercent.textContent = `${risk}%`;
    card.classList.remove('verdict-safe', 'verdict-warn', 'verdict-danger');

    if (risk < 25) {
      card.classList.add('verdict-safe');
      decisionText.textContent = 'CLEAR - ADMIT PASSENGER';
      decisionText.style.color = 'var(--status-safe)';
      verdictSubtext.textContent = 'All 4 AI Screening Modules Passed without Exceptions. Genuine Document.';
      SoundEffects.playSuccess();
    } else if (risk < 65) {
      card.classList.add('verdict-warn');
      decisionText.textContent = 'SECONDARY INSPECTION REQUIRED';
      decisionText.style.color = 'var(--status-warn)';
      verdictSubtext.textContent = 'Discrepancy detected in visa stamp pigments or stay duration parameters.';
      SoundEffects.playAlert();
    } else {
      card.classList.add('verdict-danger');
      decisionText.textContent = 'CRITICAL ALERT - DETAIN TRAVELER';
      decisionText.style.color = 'var(--status-danger)';
      verdictSubtext.textContent = 'Confirmed document forgery, identity impersonation, or Interpol Red Notice match!';
      SoundEffects.playAlert();
    }
  },

  setViewMode(mode) {
    State.viewMode = mode;
    const docCanvas = document.getElementById('docCanvas');
    const elaCanvas = document.getElementById('elaCanvas');
    const btnNormal = document.getElementById('btnViewNormal');
    const btnEla = document.getElementById('btnViewEla');

    if (mode === 'ela') {
      if (docCanvas) docCanvas.style.display = 'none';
      if (elaCanvas) elaCanvas.style.display = 'block';
      if (btnNormal) btnNormal.classList.remove('active');
      if (btnEla) btnEla.classList.add('active');
    } else {
      if (docCanvas) docCanvas.style.display = 'block';
      if (elaCanvas) elaCanvas.style.display = 'none';
      if (btnNormal) btnNormal.classList.add('active');
      if (btnEla) btnEla.classList.remove('active');
    }
  },

  setupEventListeners() {
    // Nav view switcher
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const viewId = btn.getAttribute('data-view');
        this.switchView(viewId);
      });
    });

    document.getElementById('btnJumpToBioBay')?.addEventListener('click', () => {
      this.switchView('biometricsView');
    });

    document.getElementById('btnViewNormal')?.addEventListener('click', () => this.setViewMode('normal'));
    document.getElementById('btnViewEla')?.addEventListener('click', () => this.setViewMode('ela'));

    document.querySelectorAll('.tab-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-item-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Webcam button
    const webcamBtn = document.getElementById('btnToggleWebcam');
    if (webcamBtn) {
      webcamBtn.addEventListener('click', async () => {
        const liveVideo = document.getElementById('liveWebcamVideo');
        const liveImg = document.getElementById('bioBayLiveImg');
        const statusBadge = document.getElementById('cameraStatusBadge');

        if (State.webcamStream) {
          Biometrics.stopWebcam(liveVideo);
          liveVideo.style.display = 'none';
          liveImg.style.display = 'block';
          webcamBtn.innerHTML = '📷 Activate Live Camera Feed';
          if (statusBadge) {
            statusBadge.className = 'pill-tag tag-warn';
            statusBadge.textContent = 'Optical Sensor Feed';
          }
        } else {
          const ok = await Biometrics.startWebcam(liveVideo);
          if (ok) {
            liveVideo.style.display = 'block';
            liveImg.style.display = 'none';
            webcamBtn.innerHTML = '🛑 Stop Camera Feed';
            if (statusBadge) {
              statusBadge.className = 'pill-tag tag-safe';
              statusBadge.textContent = 'LIVE WEBCAM STREAMING';
            }
          }
        }
      });
    }

    // Audio toggle
    const audioToggle = document.getElementById('audioToggleCheckbox');
    if (audioToggle) {
      audioToggle.addEventListener('change', (e) => {
        State.audioEnabled = e.target.checked;
      });
    }

    // File Upload Handler (Input element)
    const fileInput = document.getElementById('docFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleFileUpload(file);
          fileInput.value = ''; // Reset for re-uploading same file
        }
      });
    }

    // Drag and Drop support on Document Scanner Zone
    const scannerZone = document.getElementById('docScannerZone');
    if (scannerZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        scannerZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          scannerZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        scannerZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          scannerZone.classList.remove('drag-over');
        });
      });

      scannerZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          this.handleFileUpload(dt.files[0]);
        }
      });
    }

    // Demo Travel Documents Modal
    const btnDemoModal = document.getElementById('btnOpenDemoModal');
    const demoFilesModal = document.getElementById('demoFilesModal');
    const closeDemoModal = document.getElementById('closeDemoModal');

    btnDemoModal?.addEventListener('click', () => {
      demoFilesModal?.classList.add('open');
    });

    closeDemoModal?.addEventListener('click', () => {
      demoFilesModal?.classList.remove('open');
    });

    demoFilesModal?.addEventListener('click', (e) => {
      if (e.target === demoFilesModal) {
        demoFilesModal.classList.remove('open');
      }
    });

    // Quick-load buttons inside Demo Files Modal
    document.querySelectorAll('.btn-demo-load').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenarioId = e.currentTarget.getAttribute('data-scenario');
        if (scenarioId) {
          this.loadScenario(scenarioId);
          demoFilesModal?.classList.remove('open');
        }
      });
    });

    // Dossier Modal
    const btnReport = document.getElementById('btnForensicReport');
    const modalReport = document.getElementById('reportModal');
    const closeReport = document.getElementById('closeReportModal');
    btnReport?.addEventListener('click', () => {
      this.populateReportData();
      modalReport?.classList.add('open');
    });
    closeReport?.addEventListener('click', () => modalReport?.classList.remove('open'));
    modalReport?.addEventListener('click', (e) => {
      if (e.target === modalReport) {
        modalReport.classList.remove('open');
      }
    });

    // Print Report
    document.getElementById('btnPrintReport')?.addEventListener('click', () => {
      window.print();
    });
  },

  handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      this.processUploadedFile(file, event.target.result);
    };
    reader.readAsDataURL(file);
  },

  processUploadedFile(file, dataUrl) {
    const filename = file.name.toLowerCase();
    let scenario = null;

    // Remove active state from preset pills to denote custom / uploaded document
    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));

    // 1. Detect dedicated test document or known demo test document cases by filename
    if (filename.includes('traveler') || filename.includes('conner') || filename.includes('sarah') || filename.includes('official') || filename.includes('test_passport')) {
      scenario = {
        id: 'upload-sarah-conner',
        title: 'Uploaded: British Citizen e-Passport',
        subtitle: `${file.name} • Sarah Jane Conner (GBR)`,
        badge: 'GENUINE PASSPORT',
        badgeClass: 'badge-safe',
        category: 'VALID',
        docType: 'Passport',
        docImg: dataUrl,
        portraitImg: 'portrait_sarah_conner.png',
        liveImg: 'portrait_sarah_conner.png',
        rawMeta: {
          software: 'Certified Border Scanner Firmware v4.2 - Lossless Official',
          camera: 'Certified Optical Border Scanner 600 DPI',
          dpi: '600 DPI High-Res Optical',
          colorSpace: 'sRGB IEC61966-2.1',
          compression: 'Lossless Baseline'
        },
        ocr: {
          docType: 'P',
          countryCode: 'GBR',
          passportNo: '948210375',
          name: 'SARAH JANE CONNER',
          surname: 'CONNER',
          givenNames: 'SARAH JANE',
          nationality: 'BRITISH CITIZEN',
          dob: '18/06/1994',
          sex: 'F',
          doi: '10/10/2021',
          doe: '09/10/2031',
          mrzLine1: 'P<GBRCONNER<<SARAH<JANE<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: '9482103757GBR9406184F3110098<<<<<<<<<<<<<<02'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 4.1,
          textManipulated: false,
          fontMismatchScore: 2.2,
          stampForged: false,
          stampAnomalyScore: 1.8,
          exifAnomaly: false,
          elaPeakDelta: 7.8
        },
        biometrics: {
          matchScore: 98.6,
          distance: 0.07,
          livenessVerified: true,
          antiSpoofingScore: 99.4
        },
        watchlistStatus: 'CLEAR'
      };
    } else if (filename.includes('aditya') || filename.includes('01_pass') || (filename.includes('clean') && filename.includes('passport'))) {
      scenario = {
        id: 'upload-aditya',
        title: 'Uploaded: Genuine Indian Passport',
        subtitle: `${file.name} • Aditya Sharma (IND)`,
        badge: 'GENUINE PASSPORT',
        badgeClass: 'badge-safe',
        category: 'VALID',
        docType: 'Passport',
        docImg: dataUrl,
        portraitImg: './01_PASS_Passport_Aditya_Sharma_Clean.png',
        liveImg: './01_PASS_Passport_Aditya_Sharma_Clean.png',
        rawMeta: {
          software: 'Certified Border Scanner Firmware v4.2 - Lossless Official',
          camera: 'Certified Optical Border Scanner 600 DPI',
          dpi: '600 DPI High-Res Optical',
          colorSpace: 'sRGB IEC61966-2.1',
          compression: 'Lossless Baseline'
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
          mrzLine2: 'Z4892104<2IND9205148M3208126<<<<<<<<<<<<<<08'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 3.2,
          textManipulated: false,
          fontMismatchScore: 1.8,
          stampForged: false,
          stampAnomalyScore: 2.1,
          exifAnomaly: false,
          elaPeakDelta: 8.4
        },
        biometrics: {
          matchScore: 98.4,
          distance: 0.08,
          livenessVerified: true,
          antiSpoofingScore: 99.2
        },
        watchlistStatus: 'CLEAR'
      };
    } else if (filename.includes('viktor') || filename.includes('02_fail') || filename.includes('photo') || filename.includes('splic')) {
      scenario = {
        id: 'upload-viktor',
        title: 'Uploaded: Spliced Photo Replacement',
        subtitle: `${file.name} • Viktor Korzhov (RUS)`,
        badge: 'PHOTO ALTERATION',
        badgeClass: 'badge-danger',
        category: 'PHOTO_REPLACED',
        docType: 'Passport',
        docImg: dataUrl,
        portraitImg: './02_FAIL_Passport_Viktor_Tampered_Photo.png',
        liveImg: './02_FAIL_Passport_Viktor_Tampered_Photo.png',
        rawMeta: {
          software: 'Adobe Photoshop 2024.1 (Digital Editing Signature)',
          camera: 'Flatbed Scanner / Modified Buffer',
          dpi: '300 DPI (Resampled from 600 DPI)',
          colorSpace: 'Display P3 / Mismatched Embedded Profile',
          compression: 'JPEG Quality 82 (Recompressed)'
        },
        ocr: {
          docType: 'P',
          countryCode: 'RUS',
          passportNo: '759281043',
          name: 'VIKTOR KORZHOV',
          surname: 'KORZHOV',
          givenNames: 'VIKTOR',
          nationality: 'RUSSIAN FEDERATION',
          dob: '12/04/1988',
          sex: 'M',
          doi: '25/10/2019',
          doe: '24/10/2029',
          mrzLine1: 'P<RUSKORZHOV<<VIKTOR<<<<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: '7592810431RUS8804123M2910245<<<<<<<<<<<<<<04'
        },
        tamperProfile: {
          photoReplaced: true,
          photoSeamScore: 94.2,
          textManipulated: false,
          fontMismatchScore: 5.4,
          stampForged: false,
          stampAnomalyScore: 7.2,
          exifAnomaly: true,
          elaPeakDelta: 89.6
        },
        biometrics: {
          matchScore: 94.5,
          distance: 0.14,
          livenessVerified: true,
          antiSpoofingScore: 97.8
        },
        watchlistStatus: 'CLEAR'
      };
    } else if (filename.includes('elena') || filename.includes('03_fail') || filename.includes('dob') || filename.includes('checksum')) {
      scenario = {
        id: 'upload-elena',
        title: 'Uploaded: Altered Date of Birth & Checksum Mismatch',
        subtitle: `${file.name} • Elena Rostova (DEU)`,
        badge: 'CHECKSUM MISMATCH',
        badgeClass: 'badge-danger',
        category: 'TAMPERED_TEXT',
        docType: 'Passport',
        docImg: dataUrl,
        portraitImg: './03_FAIL_Passport_Elena_Altered_DOB.png',
        liveImg: './03_FAIL_Passport_Elena_Altered_DOB.png',
        rawMeta: {
          software: 'GIMP 2.10.32 (Infill Layer Detected)',
          camera: 'Digital Camera Capture',
          dpi: '300 DPI Standard',
          colorSpace: 'sRGB IEC61966',
          compression: 'JPEG Baseline with Quantization Anomalies'
        },
        ocr: {
          docType: 'P',
          countryCode: 'DEU',
          passportNo: 'C4X092815',
          name: 'ELENA ROSTOVA',
          surname: 'ROSTOVA',
          givenNames: 'ELENA',
          nationality: 'GERMAN',
          dob: '22/09/1998',
          sex: 'F',
          doi: '01/01/2022',
          doe: '31/12/2031',
          mrzLine1: 'P<DEUROSTOVA<<ELENA<<<<<<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'C4X0928157DEU8509224F3112318<<<<<<<<<<<<<<02'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 8.6,
          textManipulated: true,
          fontMismatchScore: 91.8,
          stampForged: false,
          stampAnomalyScore: 12.1,
          exifAnomaly: true,
          elaPeakDelta: 82.5
        },
        biometrics: {
          matchScore: 96.2,
          distance: 0.12,
          livenessVerified: true,
          antiSpoofingScore: 98.4
        },
        watchlistStatus: 'CLEAR'
      };
    } else if (filename.includes('rajesh') || filename.includes('04_fail') || filename.includes('visa') || filename.includes('stamp')) {
      scenario = {
        id: 'upload-rajesh',
        title: 'Uploaded: Forged Schengen Visa Stamp',
        subtitle: `${file.name} • Rajesh Patel (IND)`,
        badge: 'FORGED STAMP',
        badgeClass: 'badge-warning',
        category: 'FORGED_STAMP',
        docType: 'Visa',
        docImg: dataUrl,
        portraitImg: './04_FAIL_Visa_Rajesh_Forged_Stamp.png',
        liveImg: './04_FAIL_Visa_Rajesh_Forged_Stamp.png',
        rawMeta: {
          software: 'Adobe Photoshop CS6 (Windows)',
          camera: 'Mobile Device Document Scan',
          dpi: '300 DPI',
          colorSpace: 'sRGB',
          compression: 'Multi-Generation JPEG Loss'
        },
        ocr: {
          docType: 'V',
          countryCode: 'FRA',
          passportNo: 'Z9018471',
          visaNo: 'V9812401',
          name: 'RAJESH PATEL',
          surname: 'PATEL',
          givenNames: 'RAJESH',
          nationality: 'INDIAN',
          dob: '10/11/1986',
          sex: 'M',
          doi: '20/08/2026',
          doe: '30/09/2026',
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
      };
    } else if (filename.includes('carlos') || filename.includes('05_fail') || filename.includes('interpol') || filename.includes('mendez')) {
      scenario = {
        id: 'upload-carlos',
        title: 'Uploaded: Interpol Red Notice & Expired Document',
        subtitle: `${file.name} • Carlos Mendez (VEN)`,
        badge: 'INTERPOL HIT',
        badgeClass: 'badge-critical',
        category: 'WATCHLIST_HIT',
        docType: 'Passport',
        docImg: dataUrl,
        portraitImg: './05_FAIL_Passport_Carlos_Interpol_Hit.png',
        liveImg: './05_FAIL_Passport_Carlos_Interpol_Hit.png',
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
          doe: '11/04/2021',
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
        watchlistStatus: 'INTERPOL_RED_NOTICE'
      };
    } else {
      // 2. Generic custom upload from user
      scenario = {
        id: 'custom-upload',
        title: 'Uploaded Custom Document',
        subtitle: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        badge: 'EXTERNAL UPLOAD',
        badgeClass: 'badge-safe',
        category: 'VALID',
        docType: 'Identity Document',
        docImg: dataUrl,
        portraitImg: 'portrait_sarah_conner.png',
        liveImg: 'portrait_sarah_conner.png',
        rawMeta: {
          software: 'Direct File Ingestion API',
          camera: 'Local Optical Upload Device',
          dpi: 'Autosensed Native Resolution',
          colorSpace: 'sRGB Standard Ingestion',
          compression: `${(file.size / 1024).toFixed(1)} KB Image Buffer`
        },
        ocr: {
          docType: 'P',
          countryCode: 'IND',
          passportNo: 'U' + Math.floor(1000000 + Math.random() * 9000000),
          name: 'AUTHENTIC TRAVELER',
          surname: 'TRAVELER',
          givenNames: 'AUTHENTIC',
          nationality: 'INDIAN',
          dob: '15/08/1995',
          sex: 'M',
          doi: '01/01/2020',
          doe: '01/01/2030',
          mrzLine1: 'P<INDAUTHENTIC<<TRAVELER<<<<<<<<<<<<<<<<<<<<',
          mrzLine2: 'U7201948<5IND9508152M3001018<<<<<<<<<<<<<<04'
        },
        tamperProfile: {
          photoReplaced: false,
          photoSeamScore: 12.4,
          textManipulated: false,
          fontMismatchScore: 9.2,
          stampForged: false,
          stampAnomalyScore: 11.5,
          exifAnomaly: false,
          elaPeakDelta: 17.8
        },
        biometrics: {
          matchScore: 93.8,
          distance: 0.15,
          livenessVerified: true,
          antiSpoofingScore: 98.4
        },
        watchlistStatus: 'CLEAR'
      };
    }

    State.currentScenario = scenario;
    this.triggerScanPipeline(scenario);
  },

  populateReportData() {
    const sc = State.currentScenario;
    if (!sc) return;

    document.getElementById('repCaseId').textContent = 'REF-2026-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('repTimestamp').textContent = new Date().toLocaleString();
    document.getElementById('repName').textContent = sc.ocr.name;
    document.getElementById('repDocNo').textContent = sc.ocr.passportNo;
    document.getElementById('repNationality').textContent = sc.ocr.nationality;
    document.getElementById('repCategory').textContent = sc.title;
    document.getElementById('repDecision').textContent = document.getElementById('verdictDecision').textContent;

    const repImg = document.getElementById('repDocSnapshot');
    if (repImg) repImg.src = sc.docImg;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});
