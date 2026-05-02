import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://moalketbi.github.io',
  base: '/odd-server-manager-wiki',
  redirects: {
    '/': '/odd-server-manager-wiki/en/',
  },
  integrations: [
    starlight({
      title: 'ODD Server Manager',
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: false,
      },
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        ar: { label: 'العربية', lang: 'ar', dir: 'rtl' },
      },
      social: {
        discord: 'https://discord.gg/PLACEHOLDER_INVITE',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting started',
          translations: { ar: 'البداية' },
          items: [
            { label: 'Welcome', translations: { ar: 'الرئيسية' }, link: '/' },
          ],
        },
        {
          label: 'Your server',
          translations: { ar: 'الخادم' },
          items: [
            { label: 'Install a server', translations: { ar: 'تثبيت الخادم' }, link: '/install-server/' },
            { label: 'Start, stop & restart', translations: { ar: 'تشغيل وإيقاف' }, link: '/start-stop/' },
            { label: 'Add mods', translations: { ar: 'إضافة المودات' }, link: '/add-mods/' },
            { label: 'Extract game data', translations: { ar: 'استخراج بيانات اللعبة' }, link: '/extractor/' },
            { label: 'Server plugins', translations: { ar: 'إضافات الخادم' }, link: '/plugins/' },
            { label: 'RCON shortcuts', translations: { ar: 'اختصارات RCON' }, link: '/rcon-commands/' },
            { label: 'Backups & restore', translations: { ar: 'النسخ الاحتياطية والاستعادة' }, link: '/backups/' },
          ],
        },
        {
          label: 'Help',
          translations: { ar: 'المساعدة' },
          items: [
            { label: 'Port forwarding', translations: { ar: 'إعادة توجيه المنافذ' }, link: '/port-forwarding/' },
          ],
        },
      ],
    }),
  ],
});
