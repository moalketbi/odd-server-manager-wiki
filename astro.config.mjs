import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://moalketbi.github.io',
  base: '/odd-server-manager-wiki',
  integrations: [
    starlight({
      title: 'ODD Server Manager',
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
            { label: 'Install server', translations: { ar: 'التثبيت' }, link: '/install-server/' },
            { label: 'Start & stop', translations: { ar: 'تشغيل وإيقاف' }, link: '/start-stop/' },
            { label: 'Plugins', translations: { ar: 'الإضافات' }, link: '/plugins/' },
            { label: 'Extractor', translations: { ar: 'المستخرج' }, link: '/extractor/' },
            { label: 'Backups', translations: { ar: 'النسخ الاحتياطية' }, link: '/backups/' },
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
