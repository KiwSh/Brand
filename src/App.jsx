import AuraBrand from './AuraBrand'
import { LanguageProvider } from './hooks/useLanguage'

function App() {
  return (
    <LanguageProvider>
      <AuraBrand />
    </LanguageProvider>
  )
}

export default App
