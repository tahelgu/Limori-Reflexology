const testimonialGallery = document.querySelector('#testimonial-gallery')
const testimonialGroups = [
  [
    { src: 'images/P1.png', alt: 'צילום מסך של הודעת המלצה על טיפול מרגיע ותומך.' },
    { src: 'images/P2.png', alt: 'צילום מסך של הודעת המלצה על ליווי לנשים בתקופות של שינוי.' },
  ],
  [
    { src: 'images/P3.png', alt: 'צילום מסך של הודעת תודה על תחושה טובה יותר לאחר טיפול.' },
    { src: 'images/P4.png', alt: 'צילום מסך של הודעת המלצה על טיפול מרגיע ותומך.' },
  ],
  [
    { src: 'images/P5.png', alt: 'צילום מסך של התכתבות תודה והתפעלות מתהליך לידה.' },
    { src: 'images/P6.png', alt: 'צילום מסך של הודעת תודה על ליווי לקראת לידה.' },
  ],
]

const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.main-nav')
const accessibilityToggle = document.querySelector('.accessibility-toggle')
const accessibilityPanel = document.querySelector('.accessibility-panel')
function closeNavigation(restoreFocus = false) {
  navigation?.classList.remove('is-open')
  menuButton?.setAttribute('aria-expanded', 'false')
  menuButton?.setAttribute('aria-label', 'פתיחת תפריט')
  if (restoreFocus) menuButton?.focus()
}
menuButton?.addEventListener('click', () => {
  const open = navigation?.classList.toggle('is-open') ?? false
  menuButton.setAttribute('aria-expanded', String(open))
  menuButton.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט')
})
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  closeNavigation()
}))
accessibilityToggle?.addEventListener('click', () => {
  const open = accessibilityPanel?.hidden ?? true
  if (accessibilityPanel) accessibilityPanel.hidden = !open
  accessibilityToggle.setAttribute('aria-expanded', String(open))
  accessibilityToggle.closest('.accessibility-tools')?.classList.toggle('is-open', open)
})

const accessibilitySettingClasses = {
  contrast: 'a11y-high-contrast',
  links: 'a11y-underlined-links',
  motion: 'a11y-motion-paused',
}
function setAccessibilitySetting(setting, enabled, persist = true) {
  const className = accessibilitySettingClasses[setting]
  if (!className) return
  document.body.classList.toggle(className, enabled)
  document.querySelectorAll(`[data-a11y-setting="${setting}"]`).forEach((button) => {
    button.setAttribute('aria-pressed', String(enabled))
  })
  if (persist) {
    try {
      localStorage.setItem(`limori-a11y-${setting}`, String(enabled))
    } catch {}
  }
  updateMarqueeToggleLabel()
  updateMarqueeAnimation()
}
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  if (navigation?.classList.contains('is-open')) closeNavigation(true)
  if (accessibilityPanel && !accessibilityPanel.hidden) {
    accessibilityPanel.hidden = true
    accessibilityToggle?.setAttribute('aria-expanded', 'false')
    accessibilityToggle?.closest('.accessibility-tools')?.classList.remove('is-open')
    accessibilityToggle?.focus()
  }
})

const supportMarquee = document.querySelector('.support-marquee')
const supportTrack = document.querySelector('.support-track')
const marqueeToggle = document.querySelector('#marquee-toggle')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let marqueePaused = prefersReducedMotion
let marqueeSlow = false
function updateMarqueeToggleLabel() {
  if (!marqueeToggle) return
  const paused = marqueePaused || document.body.classList.contains('a11y-motion-paused')
  marqueeToggle.setAttribute('aria-pressed', String(paused))
  marqueeToggle.textContent = prefersReducedMotion ? 'הגלילה מושהית לפי הגדרת המכשיר' : paused ? 'הפעלת גלילת האייקונים' : 'השהיית גלילת האייקונים'
  marqueeToggle.disabled = prefersReducedMotion
}
function updateMarqueeAnimation() {
  if (!supportTrack) return
  supportTrack.getAnimations().forEach((animation) => {
    if (marqueePaused || prefersReducedMotion || document.body.classList.contains('a11y-motion-paused')) {
      animation.pause()
    } else {
      animation.playbackRate = marqueeSlow ? 0.35 : 1
      animation.play()
    }
  })
}
Object.keys(accessibilitySettingClasses).forEach((setting) => {
  let enabled = false
  try {
    enabled = localStorage.getItem(`limori-a11y-${setting}`) === 'true'
  } catch {}
  setAccessibilitySetting(setting, enabled, false)
})
document.querySelectorAll('[data-a11y-setting]').forEach((button) => button.addEventListener('click', () => {
  const setting = button.dataset.a11ySetting
  setAccessibilitySetting(setting, button.getAttribute('aria-pressed') !== 'true')
}))
document.querySelectorAll('[data-a11y-reset]').forEach((button) => button.addEventListener('click', () => {
  Object.keys(accessibilitySettingClasses).forEach((setting) => setAccessibilitySetting(setting, false))
  marqueePaused = prefersReducedMotion
  marqueeSlow = false
  updateMarqueeToggleLabel()
  updateMarqueeAnimation()
  if (accessibilityPanel) accessibilityPanel.hidden = true
  accessibilityToggle?.setAttribute('aria-expanded', 'false')
  accessibilityToggle?.closest('.accessibility-tools')?.classList.remove('is-open')
  accessibilityToggle?.focus()
}))
marqueeToggle?.addEventListener('click', () => {
  marqueePaused = !marqueePaused
  updateMarqueeToggleLabel()
  updateMarqueeAnimation()
})
supportMarquee?.querySelectorAll('.tag-icon').forEach((icon) => {
  icon.addEventListener('pointerenter', () => {
    marqueeSlow = true
    updateMarqueeAnimation()
  })
  icon.addEventListener('pointerleave', () => {
    marqueeSlow = false
    updateMarqueeAnimation()
  })
})
supportMarquee?.addEventListener('focusin', () => {
  marqueeSlow = true
  updateMarqueeAnimation()
})
supportMarquee?.addEventListener('focusout', (event) => {
  if (!supportMarquee.contains(event.relatedTarget)) {
    marqueeSlow = false
    updateMarqueeAnimation()
  }
})
updateMarqueeToggleLabel()
updateMarqueeAnimation()

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  const newTabNotice = 'נפתח בכרטיסייה חדשה'
  const label = link.getAttribute('aria-label')
  if (label) {
    if (!label.includes('כרטיסייה חדשה')) link.setAttribute('aria-label', `${label} (${newTabNotice})`)
  } else if (!link.textContent.includes('כרטיסייה חדשה') && !link.querySelector('[data-new-tab-notice]')) {
    const notice = document.createElement('span')
    notice.className = 'visually-hidden'
    notice.dataset.newTabNotice = ''
    notice.textContent = ` (${newTabNotice})`
    link.append(notice)
  }
})

const treatmentDialog = document.querySelector('#treatment-dialog')
const treatmentDialogTitle = document.querySelector('#treatment-dialog-title')
const treatmentDialogContent = document.querySelector('#treatment-dialog-content')
const treatmentDetails = {
  reflexology: {
    title: 'רפלקסולוגיה',
    paragraphs: [
      'טיפול בגוף דרך כפות הרגליים.',
      'מיקומים בכף הרגל משויכים, לפי גישת הרפלקסולוגיה, לאיברי הגוף ולמערכותיו. באמצעות לחיצות ועיסויים ניתנת תשומת לב לאזורי המטרה.',
      'כך, לדוגמה, אם נרצה להתמקד בראש, נתמקד בבוהן הגדולה (1). אם נרצה להתמקד באוזן ימין, נתמקד במיקום שלה בכף רגל ימין, בשתי הבהונות 2 ו־3, וכך הלאה.',
      'הטיפול נעשה באמצעות ידי המטפלת, ללא עזרים חיצוניים.',
    ],
    details: [],
  },
  fertility: {
    title: 'פריון',
    paragraphs: [
      'ליווי רפלקסולוגי בתהליך הפריון יכול להתלוות להזרקת הורמונים, שאיבה, החזרה ו־IVF, וכן למצבים של חוסר איזון הורמונלי, שחלות פוליציסטיות, אנדומטריוזיס ושינויים הורמונליים נוספים.',
      'הטיפול מותאם לתהליך ויכול להתמקד בתחושת איזון גוף־נפש. לפי גישת הטיפול, ניתן להתייחס גם לחימום אזור האגן והרחם ביום ההחזרה, לצד ההנחיות של הצוות הרפואי.',
    ],
    details: [],
  },
  pregnancy: {
    title: 'היריון',
    paragraphs: [
      'ניתן לקבל טיפול רפלקסולוגי בכל חודשי ההיריון, אצל רפלקסולוג/ית בכיר/ה עם מומחיות בהיריון. לפני הטיפול מומלץ לוודא הכשרה מתאימה בתחום.',
      'לכל שליש מאפיינים ושינויים פיזיולוגיים משלו, כגון עייפות, כאבי ראש, בחילות והקאות, כאבי גב וקשיי שינה. הטיפול מותאם לשלב ההיריון ולתחושה שלך.',
      'אפשר לשלב טיפול גם לצד מעקב רפואי במצבים כגון סוכרת היריון הטיפול אינו מיועד לטפל בסוכרת עצמה.',
    ],
    details: [],
  },
  birth: {
    title: 'לידה',
    paragraphs: [
      'הכנת היולדת לקראת לידה',
      'ניתן להתחיל בשבוע 37 להיריון. הטיפול מכין את הגוף לקראת הלידה ויכול לכלול איזון גוף־נפש, שחרור האגן ועמוד השדרה התחתון, והתייחסות למערכות פנימיות כגון העיכול והנשימה.',
      'כשהצירים מופיעים, ניתן לקבל טיפול רפלקסולוגי שילווה את הגוף לקראת הלידה, גם בחדר היולדות בבית החולים.',
      'השראת לידה כוללת שיטות להבשלת צוואר הרחם וליצירת צירים אפקטיביים. ניתן לקיים טיפול רפלקסולוגי בתיאום עם היולדת וצוות חדר הלידה, גם לצד טיפולים רפואיים כגון סטריפינג, פיטוצין או אלחוש אפידורלי.',
    ],
    details: ['רפלקסולוגיה היא טיפול משלים ואינה משרה או מזרזת לידה ואינה מחליפה החלטות או טיפול של הצוות הרפואי.', 'מאחלת לך לידה קלה.'],
  },
  reiki: {
    title: 'רייקי',
    paragraphs: [
      'מפגש המותאם לקצב ולצרכים שלך, ומשלב רייקי ומגע עדין באווירה שקטה ונינוחה. המטרה היא לאפשר עצירה, הקשבה לגוף ומרחב של רוגע.',
      'בתחילת המפגש נשוחח על התחושה שלך ועל מה שהיית רוצה לקבל ממנו. אפשר לבחור טיפול רייקי ללא מגע או לשלב מגע, ואפשר להתאים או לעצור אותו בכל שלב.',
    ],
    details: [],
  },
}

let treatmentDialogTrigger
document.querySelectorAll('.treatment-details').forEach((button) => button.addEventListener('click', () => {
  const treatment = treatmentDetails[button.dataset.treatment]
  if (!treatment || !treatmentDialog || !treatmentDialogTitle || !treatmentDialogContent) return

  treatmentDialogTrigger = button
  treatmentDialogTitle.textContent = treatment.title
  treatmentDialogContent.replaceChildren()
  treatment.paragraphs.forEach((text) => {
    const paragraph = document.createElement('p')
    paragraph.textContent = text
    treatmentDialogContent.append(paragraph)
  })
  if (treatment.details.length > 0) {
    const detailsList = document.createElement('ul')
    treatment.details.forEach((text) => {
      const item = document.createElement('li')
      item.textContent = text
      detailsList.append(item)
    })
    treatmentDialogContent.append(detailsList)
  }
  treatmentDialog.showModal()
}))

document.querySelector('.treatment-dialog-close')?.addEventListener('click', () => treatmentDialog?.close())
treatmentDialog?.addEventListener('cancel', (event) => {
  event.preventDefault()
  treatmentDialog.close()
})
treatmentDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    treatmentDialog.close()
  }
})
treatmentDialog?.addEventListener('click', (event) => {
  if (event.target === treatmentDialog) treatmentDialog.close()
})
treatmentDialog?.addEventListener('close', () => treatmentDialogTrigger?.focus())

const certificateDetails = [
  {
    src: 'images/T6.png',
    alt: 'תעודת Reiki Master Teacher, דרגה 4, מכללת ברק, 2006.',
    title: 'Reiki Master Teacher',
    description: 'דרגת מאסטר 4 ברייקי, המכללה לרפואה הוליסטית טבעית, 2006.',
  },
  {
    src: 'images/T2.png',
    alt: 'תעודת לימודי רפלקסולוגיה בכיר מתקדם, בהתמחות בפריון ובלוטת התריס, 322 שעות לימוד, 2012.',
    title: 'רפלקסולוגיה בכיר מתקדם',
    description: 'התמחות בפריון ובלוטת התריס, בהיקף 322 שעות לימוד. מכללת רידמן, 2012.',
  },
  {
    src: 'images/T3.png',
    alt: 'תעודת Basic Medical Massage, דצמבר 2015.',
    title: 'Basic Medical Massage',
    description: 'תעודת לימודי עיסוי רפואי בסיסי, 4 בדצמבר 2015.',
  },
  {
    src: 'images/T4.png',
    alt: 'תעודת HHP עם התמחות ברפלקסולוגיה ובעיסוי, יולי 2016.',
    title: 'Holistic Health Practitioner',
    description: 'הכשרה תלת־שנתית עם התמחות ברפלקסולוגיה ובעיסוי, 6 ביולי 2016.',
  },
  {
    src: 'images/T1.png',
    alt: 'תעודת סיום קורס בהדרכת גילה רונאל, בהיקף 27 שעות אקדמיות, אפריל עד מאי 2025.',
    title: 'קורס הרה מאמא',
    description: 'תעודת סיום קורס בהדרכת גילה רונאל, בהיקף 27 שעות אקדמיות (אפריל–מאי 2025).',
  },
  {
    src: 'images/T5.png',
    alt: 'תעודת סיום קורס הכשרת מטפלות בחדרי לידה, 90 שעות אקדמיות, מאי עד ספטמבר 2026.',
    title: 'הכשרת מטפלות בחדרי לידה',
    description: 'תעודת סיום קורס בהיקף 90 שעות אקדמיות (מאי–ספטמבר 2026).',
  },
]
const certificateCarousel = document.querySelector('#certificate-carousel')
const certificateTrack = document.querySelector('#certificate-track')
const certificateCards = [...(certificateTrack?.querySelectorAll('.certificate-card') ?? [])]
const certificateStatus = document.querySelector('#certificate-status')
let activeCertificate = 0
function getCertificateMetrics() {
  if (!certificateTrack || certificateCards.length === 0) return { cardStep: 0, visibleCount: 1, maxIndex: 0 }
  const gap = Number.parseFloat(getComputedStyle(certificateTrack).gap) || 0
  const cardStep = certificateCards[0].getBoundingClientRect().width + gap
  const visibleCount = Math.max(1, Math.round((certificateTrack.clientWidth + gap) / cardStep))
  return { cardStep, visibleCount, maxIndex: Math.max(0, certificateCards.length - visibleCount) }
}
function updateCertificatePosition() {
  if (!certificateTrack || certificateCards.length === 0) return
  const { cardStep, visibleCount, maxIndex } = getCertificateMetrics()
  const scrollPosition = getComputedStyle(certificateTrack).direction === 'rtl' ? -certificateTrack.scrollLeft : certificateTrack.scrollLeft
  activeCertificate = Math.max(0, Math.min(maxIndex, Math.round(scrollPosition / cardStep)))
  certificateCarousel?.querySelectorAll('[data-certificate-step]').forEach((button) => {
    button.disabled = Number(button.dataset.certificateStep) < 0 ? activeCertificate === 0 : activeCertificate === maxIndex
  })
  if (certificateStatus) certificateStatus.textContent = `תעודות ${activeCertificate + 1} עד ${Math.min(certificateCards.length, activeCertificate + visibleCount)} מתוך ${certificateCards.length}`
}
certificateCarousel?.querySelectorAll('[data-certificate-step]').forEach((button) => button.addEventListener('click', () => {
  const step = Number(button.dataset.certificateStep)
  const { cardStep, maxIndex } = getCertificateMetrics()
  const nextIndex = Math.max(0, Math.min(maxIndex, activeCertificate + step))
  if (nextIndex === activeCertificate || !certificateTrack) return
  activeCertificate = nextIndex
  certificateTrack.scrollBy({ left: -step * cardStep, behavior: 'auto' })
  updateCertificatePosition()
}))
certificateTrack?.addEventListener('scroll', () => requestAnimationFrame(updateCertificatePosition), { passive: true })
window.addEventListener('resize', updateCertificatePosition)
certificateCarousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    certificateCarousel.querySelector('[data-certificate-step="-1"]')?.click()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    certificateCarousel.querySelector('[data-certificate-step="1"]')?.click()
  }
})
updateCertificatePosition()

const treatmentGrid = document.querySelector('#treatment-grid')
const treatmentCards = [...(treatmentGrid?.querySelectorAll('.treatment-card') ?? [])]
const treatmentStatus = document.querySelector('#treatment-status')
let activeTreatment = 0
function getTreatmentMetrics() {
  if (!treatmentGrid || treatmentCards.length === 0) return { gap: 0, cardStep: 0, maxIndex: 0 }
  const gap = Number.parseFloat(getComputedStyle(treatmentGrid).gap) || 0
  const cardStep = treatmentCards[0].getBoundingClientRect().width + gap
  const visibleCount = Math.max(1, Math.round((treatmentGrid.clientWidth + gap) / cardStep))
  return { gap, cardStep, visibleCount, maxIndex: Math.max(0, treatmentCards.length - visibleCount) }
}
function updateTreatmentPosition() {
  if (!treatmentGrid || treatmentCards.length === 0) return
  const { cardStep, visibleCount, maxIndex } = getTreatmentMetrics()
  const scrollPosition = getComputedStyle(treatmentGrid).direction === 'rtl' ? -treatmentGrid.scrollLeft : treatmentGrid.scrollLeft
  activeTreatment = Math.max(0, Math.min(maxIndex, Math.round(scrollPosition / cardStep)))
  document.querySelectorAll('.treatment-carousel-arrow').forEach((button) => {
    button.disabled = Number(button.dataset.treatmentStep) < 0 ? activeTreatment === 0 : activeTreatment === maxIndex
  })
  if (treatmentStatus) treatmentStatus.textContent = `תחומים ${activeTreatment + 1} עד ${Math.min(treatmentCards.length, activeTreatment + visibleCount)} מתוך ${treatmentCards.length}`
}
document.querySelectorAll('.treatment-carousel-arrow').forEach((button) => button.addEventListener('click', () => {
  const step = Number(button.dataset.treatmentStep)
  const { cardStep, visibleCount, maxIndex } = getTreatmentMetrics()
  const nextIndex = Math.max(0, Math.min(maxIndex, activeTreatment + step))
  if (nextIndex === activeTreatment || !treatmentGrid) return

  activeTreatment = nextIndex
  document.querySelectorAll('.treatment-carousel-arrow').forEach((arrow) => {
    arrow.disabled = Number(arrow.dataset.treatmentStep) < 0 ? activeTreatment === 0 : activeTreatment === maxIndex
  })
  if (treatmentStatus) treatmentStatus.textContent = `תחומים ${activeTreatment + 1} עד ${Math.min(treatmentCards.length, activeTreatment + visibleCount)} מתוך ${treatmentCards.length}`
  treatmentGrid.scrollBy({ left: -step * cardStep, behavior: 'auto' })
}))
treatmentGrid?.addEventListener('scroll', () => requestAnimationFrame(updateTreatmentPosition), { passive: true })
window.addEventListener('resize', updateTreatmentPosition)
updateTreatmentPosition()

let activeSlide = 0
const dots = document.querySelectorAll('.dots button')
function showSlide(index) {
  activeSlide = (index + testimonialGroups.length) % testimonialGroups.length
  if (testimonialGallery) {
    testimonialGallery.replaceChildren(...testimonialGroups[activeSlide].map(({ src, alt }) => {
      const frame = document.createElement('figure')
      frame.className = 'testimonial-frame'
      const image = document.createElement('img')
      image.src = src
      image.alt = alt
      image.loading = 'lazy'
      frame.append(image)
      return frame
    }))
  }
  dots.forEach((dot, dotIndex) => {
    const selected = dotIndex === activeSlide
    dot.classList.toggle('selected', selected)
    dot.setAttribute('aria-pressed', String(selected))
  })
}
document.querySelectorAll('.carousel-arrow').forEach((button) => button.addEventListener('click', () => showSlide(activeSlide + Number(button.dataset.direction))))
dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))))
showSlide(0)
document.querySelectorAll('[data-source]').forEach((link) => link.addEventListener('click', () => window.dispatchEvent(new CustomEvent('whatsapp_click', { detail: { source: link.dataset.source } }))))