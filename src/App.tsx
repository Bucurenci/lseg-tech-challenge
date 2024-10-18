import Header from "./components/layout/Header";
import ChatWindow from "./features/ChatWindow";
import './global.scss';

export default function App() {

  return (
      <div className="container">
          <Header />
          <ChatWindow />
      </div>
  )
}
