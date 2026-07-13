const FEATURES = [
  {
    title: "Price match promise",
    body: "Find it cheaper elsewhere in the UK and we'll match it, no questions asked.",
  },
  {
    title: "Trade in your old phone",
    body: "Get an instant estimate and money off your next handset the same day.",
  },
  {
    title: "Fast UK-wide delivery",
    body: "Order before 8pm and get your phone the next working day, tracked and insured.",
  },
]

export default function Features() {
  return (
    <section className="features">
      {FEATURES.map((feature) => (
        <div className="feature-card" key={feature.title}>
          <h2>{feature.title}</h2>
          <p>{feature.body}</p>
        </div>
      ))}
    </section>
  )
}
