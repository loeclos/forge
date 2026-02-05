package main

import tea "github.com/charmbracelet/bubbletea"

func main() {
	m := New()

	p := tea.NewProgram(m)
	p.Run()
}
