// components/FontTest.tsx
'use client';

export default function FontTest() {
  return (
    <div className="p-8 border-2 border-red-500 m-4">
      <h2 className="text-2xl font-bold mb-4">Font Test</h2>
      
      <div className="mb-4">
        <p className="font-bold">Applied classes on body:</p>
        <code className="bg-gray-100 p-2 block">
          {document.body.className}
        </code>
      </div>
      
      <div className="mb-4">
        <p className="font-bold">Test paragraphs:</p>
        <p style={{ fontFamily: 'var(--font-cause), sans-serif' }}>
          This uses CSS variable --font-cause (English)
        </p>
        <p style={{ fontFamily: 'var(--font-cause), sans-serif' }}>
          هذا يستخدم متغير CSS --font-cause (Arabic)
        </p>
        <p style={{ fontFamily: 'var(--font-cause), sans-serif' }}>
          Ceci utilise la variable CSS --font-cause (French)
        </p>
      </div>
      
      <div className="mb-4">
        <p className="font-bold">With Tailwind classes:</p>
        <p className="font-sans">font-sans class (English)</p>
        <p className="font-sans">فئة font-sans (Arabic)</p>
        <p className="font-sans">Classe font-sans (French)</p>
      </div>
    </div>
  );
}