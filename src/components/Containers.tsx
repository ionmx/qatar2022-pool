import tw from "tailwind-styled-components"

const DefaultContainer = tw.main<any>`
  max-w-7xl
  mx-auto py-6 
  sm:px-6 
  lg:px-8
  p-2
  relative
  top-16
  pb-24
`
const MatchesContainer = tw(DefaultContainer)<any>`
  grid 
  grid-cols-1 
  md:grid-cols-2 
  gap-4
`

const PredictionsContainer = tw(MatchesContainer)<any>``

export { DefaultContainer, MatchesContainer, PredictionsContainer };
