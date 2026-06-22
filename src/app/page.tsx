import Link from "next/link";
import { getVarianteAtiva } from "@/lib/abtest";
import HomeCTAButton from "./HomeCTAButton";

const stats = [
  { value: "500+", label: "Restaurantes" },
  { value: "50k+", label: "Entregas" },
  { value: "30min", label: "Tempo médio" },
  { value: "4.9", label: "Avaliação" },
];

const steps = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
    ),
    title: "Escolha",
    desc: "Navegue pelos melhores restaurantes e encontre o que você está com vontade",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
    ),
    title: "Peça",
    desc: "Adicione os itens ao carrinho, escolha o pagamento e finalize em segundos",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
    ),
    title: "Receba",
    desc: "Acompanhe a entrega em tempo real e receba na porta da sua casa",
    color: "bg-purple-100 text-purple-600",
  },
];

const categories = [
  { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop", name: "Hambúrgueres", emoji: "🍔" },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop", name: "Pizzas", emoji: "🍕" },
  { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&fit=crop", name: "Japonês", emoji: "🍣" },
  { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop", name: "Saudável", emoji: "🥗" },
  { img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=300&fit=crop", name: "Massas", emoji: "🍝" },
  { img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop", name: "Brasileira", emoji: "🥩" },
  { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop", name: "Sobremesas", emoji: "🍰" },
  { img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop", name: "Saladas", emoji: "🥬" },
];

export default async function Home() {
  const variante = await getVarianteAtiva("cta_texto_home");
  const ctaTexto = (variante?.config?.ctaTexto as string) || "Pedir Agora";
  const ctaIcone = (variante?.config?.ctaIcon as string) || "→";
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-zinc-100/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-orange-600">Come</span>
            <span className="text-zinc-900">Já</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn-ghost text-sm font-medium">Entrar</Link>
            <Link href="/auth/register" className="btn-primary text-sm px-5 py-2.5">Cadastrar</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-zinc-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 w-full py-32">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-dark px-5 py-2 text-sm font-medium text-white border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Entrega em até 30 minutos
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Sua comida favorita,{" "}
              <span className="text-gradient-hero">mais rápida</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-xl leading-relaxed">
              Peça dos melhores restaurantes locais e receba em casa ou no trabalho com apenas alguns toques. Milhares de opções esperando por você.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <HomeCTAButton
                texto={ctaTexto}
                href="/auth/register?role=COMPRADOR"
                icone={ctaIcone}
              />
              <Link
                href="/auth/register?role=RESTAURANTE"
                className="inline-flex items-center justify-center gap-2 rounded-full glass-dark px-8 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                Sou Restaurante
              </Link>
            </div>
          </div>
        </div>

        {/* Floating food images */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block pr-16">
          <div className="relative">
            <div className="h-72 w-72 rounded-3xl overflow-hidden shadow-2xl rotate-6 animate-float-slow opacity-80">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="h-48 w-48 rounded-3xl overflow-hidden shadow-2xl -rotate-3 absolute -bottom-20 -left-20 animate-float opacity-70">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="h-40 w-40 rounded-3xl overflow-hidden shadow-2xl rotate-12 absolute -top-12 -right-12 animate-float-slow opacity-60" style={{ animationDelay: "1s" }}>
              <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&fit=crop" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-50 to-transparent" />
      </section>

      {/* Stats */}
      <section className="relative -mt-20 z-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="card-premium p-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge badge-primary mb-4">Como funciona</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              Peça sua comida em 3 passos
            </h2>
            <p className="mt-3 text-lg text-zinc-500">
              Rápido, simples e direto da cozinha até sua mesa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative animate-fade-in group" style={{ animationDelay: `${i * 150}ms` }}>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-orange-200" style={{ zIndex: 0 }} />
                )}
                <div className="relative z-10 card-premium p-8 text-center">
                  <div className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color} transition-transform duration-300 group-hover:scale-110`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                  <p className="mt-3 text-zinc-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge badge-primary mb-4">Cardápio</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              Escolha sua categoria
            </h2>
            <p className="mt-3 text-lg text-zinc-500">
              Do hambúrguer à salada, temos o que você procura
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className="group relative card-premium p-5 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative h-28 rounded-xl overflow-hidden mb-4">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-2xl drop-shadow-lg">{cat.emoji}</span>
                </div>
                <h3 className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors text-sm text-center">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge badge-primary mb-4">Depoimentos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Ana Silva", role: "Cliente", text: "Pedido chegou em 20 minutos! A comida estava quentinha e o entregador super educado. Virei cliente fiel!", rating: 5, avatar: "AS" },
              { name: "Carlos Oliveira", role: "Restaurante", text: "O ComeJá aumentou nossas vendas em 40% no primeiro mês. Plataforma intuitiva e suporte excelente.", rating: 5, avatar: "CO" },
              { name: "Maria Santos", role: "Entregadora", text: "Trabalho no meu horário e ganho bem. As entregas são bem organizadas e o app é muito fácil de usar.", rating: 5, avatar: "MS" },
            ].map((testimonial, i) => (
              <div key={i} className="card-premium p-6 animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{testimonial.name}</p>
                    <p className="text-xs text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
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
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&h=500&fit=crop"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-orange-700/90 to-orange-800/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

            <div className="relative p-10 sm:p-16 lg:p-20">
              <div className="max-w-2xl">
                <span className="badge bg-white/20 text-white border border-white/20 mb-4">Parceiro</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Seja um parceiro ComeJá
                </h2>
                <p className="mt-4 text-lg text-orange-100 leading-relaxed max-w-xl">
                  Cadastre seu restaurante e alcance centenas de novos clientes todos os dias. Aumente suas vendas sem custo inicial.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/register?role=RESTAURANTE"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-orange-600 hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    Cadastrar Restaurante
                    <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <Link
                    href="/auth/register?role=ENTREGADOR"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-8 py-4 font-bold text-white border border-white/30 hover:bg-white/20 transition-all"
                  >
                    Quero entregar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                <span className="text-orange-600">Come</span>
                <span className="text-zinc-900">Já</span>
              </Link>
              <p className="mt-3 text-sm text-zinc-500 leading-relaxed max-w-xs">
                Comida rápida, entrega mais rápida. Conectamos você aos melhores restaurantes da sua região.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider mb-4">Para você</h4>
              <ul className="space-y-3">
                {["Pedir comida", "Restaurantes", "Categorias", "Promoções"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-zinc-500 hover:text-orange-600 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider mb-4">Parceiros</h4>
              <ul className="space-y-3">
                {["Cadastrar restaurante", "Ser entregador", "Central do parceiro", "Termos".toString()].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-zinc-500 hover:text-orange-600 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider mb-4">Ajuda</h4>
              <ul className="space-y-3">
                {["Central de ajuda", "Privacidade", "Termos de uso", "Fale conosco"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-zinc-500 hover:text-orange-600 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              &copy; 2026 Come Já. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { name: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map((social) => (
                <a key={social.name} href="#" className="text-zinc-400 hover:text-orange-500 transition-colors" aria-label={social.name}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.d} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
