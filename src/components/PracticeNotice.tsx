import { useLocale } from '../i18n';

const LINKS = {
  chile: 'https://www.jugadoresanonimoschile.cl/',
  chilePhone: 'tel:+56983429868',
  scj: 'https://autoexclusion.scj.gob.cl/',
  spain: 'https://fejar.org/',
  spainPhone: 'tel:900200225',
  us: 'tel:18004262537',
} as const;

export function PracticeNotice() {
  const { t } = useLocale();

  return (
    <section
      aria-label={t.notice.title}
      className="mb-3 rounded-xl border border-amber-600/70 bg-amber-950/50 px-3 py-2 text-xs leading-relaxed text-amber-50"
    >
      <p className="font-semibold">
        <span className="mr-2 inline-block rounded bg-amber-300 px-1.5 py-0.5 font-black text-gray-950">
          {t.notice.badge}
        </span>
        {t.notice.title}
      </p>
      <p className="mt-1 text-amber-50">{t.notice.body}</p>
      <p className="mt-1 text-amber-50">
        {t.notice.helpIntro}{' '}
        <a className="underline" href={LINKS.chile} target="_blank" rel="noopener noreferrer">
          {t.notice.helpChile}
        </a>{' '}
        <a className="underline" href={LINKS.chilePhone}>
          +56 9 8342 9868
        </a>
        {' · '}
        <a className="underline" href={LINKS.scj} target="_blank" rel="noopener noreferrer">
          {t.notice.helpScj}
        </a>
        {' · '}
        <a className="underline" href={LINKS.spain} target="_blank" rel="noopener noreferrer">
          {t.notice.helpSpain}
        </a>{' '}
        <a className="underline" href={LINKS.spainPhone}>
          900 200 225
        </a>
        {' · '}
        <a className="underline" href={LINKS.us}>
          {t.notice.helpUs}
        </a>
      </p>
      <p className="mt-1 text-amber-100">{t.notice.rules}</p>
      <p className="mt-1 text-amber-100">{t.notice.privacy}</p>
    </section>
  );
}
