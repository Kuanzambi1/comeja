import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-orange-600">Come</span>
            <span className="text-zinc-900">Já</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Entrar</Link>
            <Link href="/auth/register" className="btn-primary text-sm">Cadastrar</Link>
          </div>
        </div>
      </header>

      {/* Hero with background image */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop"
          alt="Food delivery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 w-full">
          <div className="max-w-2xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-5 py-2 text-sm font-medium text-white border border-white/20">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-soft" />
              Entrega em até 30 minutos
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.05]">
              Sua comida favorita,{" "}
              <span className="text-orange-400">mais rápida</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-200 sm:text-xl max-w-xl">
              Peça dos melhores restaurantes locais e receba em casa ou no trabalho com apenas alguns toques.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register?role=COMPRADOR"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white hover:bg-orange-600 transition shadow-2xl shadow-orange-500/30"
              >
                Pedir Agora
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/auth/register?role=RESTAURANTE"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-8 py-4 text-base font-bold text-white border border-white/30 hover:bg-white/25 transition"
              >
                Sou Restaurante
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 to-transparent" />
      </section>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Como funciona</h2>
            <p className="mt-3 text-lg text-zinc-500">Peça sua comida em 3 passos simples</p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", step: "01", title: "Escolha", desc: "Navegue pelos melhores restaurantes e encontre o que você está com vontade" },
              { img: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop", step: "02", title: "Peça", desc: "Adicione os itens ao carrinho, escolha o pagamento e finalize em segundos" },
              { img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop", step: "03", title: "Receba", desc: "Acompanhe a entrega em tempo real e receba na porta da sua casa" },
            ].map((step, i) => (
              <div key={i} className="group animate-fade-in text-center" style={{ animationDelay: `${i * 150}ms` } as React.CSSProperties}>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                  <img src={step.img} alt={step.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-orange-600">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Categorias</h2>
            <p className="mt-3 text-lg text-zinc-500">Encontre o que você está com vontade</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", name: "Hambúrgueres" },
              { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop", name: "Pizzas" },
              { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop", name: "Japonês" },
              { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop", name: "Saudável" },
              { img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop", name: "Massas" },
              { img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop", name: "Brasileira" },
              { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop", name: "Sobremesas" },
              { img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop", name: "Saladas" },
            ].map((cat) => (
              <div key={cat.name} className="card flex items-center gap-4 p-4 hover:border-orange-200 hover:bg-orange-50/50 transition-all cursor-pointer group">
                <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                  <img src={cat.img} alt={cat.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
                <span className="font-semibold text-zinc-800">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop"
              alt="Seja um parceiro"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative bg-gradient-to-r from-orange-600/95 to-orange-700/90 p-10 sm:p-16">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Seja um parceiro</h2>
                <p className="mt-4 text-lg text-orange-100">
                  Cadastre seu restaurante e alcance centenas de novos clientes todos os dias.
                </p>
                <Link
                  href="/auth/register?role=RESTAURANTE"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-orange-600 hover:bg-orange-50 transition shadow-xl"
                >
                  Cadastrar Restaurante
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                <span className="text-orange-600">Come</span>
                <span className="text-zinc-900">Já</span>
              </Link>
              <p className="mt-2 text-sm text-zinc-500">Comida rápida, entrega mais rápida.</p>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <Link href="#" className="hover:text-zinc-900 transition">Termos</Link>
              <Link href="#" className="hover:text-zinc-900 transition">Privacidade</Link>
              <Link href="#" className="hover:text-zinc-900 transition">Ajuda</Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-zinc-400">
            &copy; 2026 Come Já. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
