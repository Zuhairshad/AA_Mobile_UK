import { Link } from "react-router-dom"
import { devicesForGuide, difficultyTone, guides } from "../data/guides"
import { devices, partKindLabels } from "../data/devices"
import Badge from "../components/ui/Badge"
import Breadcrumbs from "../components/ui/Breadcrumbs"
import Icon from "../components/ui/Icon"
import { buttonClass } from "../components/ui/Button"

export default function Guides() {
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="content-boundary py-8 md:py-10">
          <Breadcrumbs
            trail={[{ label: "Home", to: "/" }, { label: "Repair guides" }]}
          />
          <h1 className="section-heading mt-4">Repair guides</h1>
          <p className="section-lede mt-2 max-w-3xl">
            The process we follow on our own bench, written out step by step. We
            would rather you did the repair yourself and bought the part from us
            than paid someone else to do it badly.
          </p>
        </div>
      </div>

      <div className="content-boundary py-10">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const covered = devicesForGuide(guide, devices).length
            return (
              <li key={guide.slug}>
                <article className="group resource-card h-full flex-col items-start gap-3">
                  <div className="flex w-full items-center justify-between gap-2">
                    <Badge tone={difficultyTone[guide.difficulty]} size="sm">
                      {guide.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Icon name="clock" className="size-3.5" />
                      {guide.time}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold group-hover:text-primary">
                    <Link
                      to={`/guide/${guide.slug}`}
                      className="stretched-link"
                    >
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-ink-500">{guide.summary}</p>

                  <p className="mt-auto flex flex-wrap gap-x-3 text-xs text-ink-500">
                    <span>{guide.steps.length} steps</span>
                    <span>{partKindLabels[guide.partKind]}</span>
                    <span>
                      {covered} {covered === 1 ? "model" : "models"}
                    </span>
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      <section className="border-t border-line bg-muted">
        <div className="content-boundary py-12 text-center">
          <h2 className="section-heading-sm text-xl md:text-2xl">
            Not sure which model you have?
          </h2>
          <p className="prose-body mx-auto mt-3 max-w-xl">
            Ordering the wrong part is the commonest mistake people make. Two
            minutes checking saves a return.
          </p>
          <Link
            to="/guide/identify-your-model"
            className={buttonClass("primary", "lg", "mt-6")}
          >
            How to identify your model
          </Link>
        </div>
      </section>
    </>
  )
}
