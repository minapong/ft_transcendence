import { createReactor } from "reactor"

export default function TournamentPage() {
  const container = createReactor("div", {
    className: "w-screen h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-4"
  })

  // Title
  const title = createReactor("h1", { className: "text-4xl font-bold mb-6" }, "New Tournament")
  container.appendChild(title)

  // Inputs for 4 players
  const inputs: HTMLInputElement[] = []
  for (let i = 0; i < 4; i++) {
    const input = createReactor("input", {
      lassName: "px-4 py-2 rounded text-bg-white justify-left",
      placeholder: `Player ${i + 1}`
    })
    inputs.push(input)
    container.appendChild(input)
  }

  // Start button
  const startBtn = createReactor("button", {
    className: "mt-4 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700",
  }, "Start Tournament")

  startBtn.addEventListener("click", () => {
    const playerNames = inputs.map(inp => inp.value).filter(name => name.trim() !== "")
    if (playerNames.length < 2) {
      alert("Enter at least 2 player names")
      return
    }
    // For now, just log it
    console.log("Starting tournament with:", playerNames)
    alert(`Starting tournament with: ${playerNames.join(", ")}`)
  })

  container.appendChild(startBtn)
  return container
}
