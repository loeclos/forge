package dialog

// A simple example that shows how to retrieve a value from a Bubble Tea
// program after the Bubble Tea has exited.

import (
	"fmt"
	"image/color"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/lucasb-eyer/go-colorful"
	"github.com/muesli/gamut"
)

var choices = []string{"no", "yes"}

var (
	subtle = lipgloss.AdaptiveColor{Light: "#D9DCCF", Dark: "#383838"}

	blends         = gamut.Blends(lipgloss.Color("#F25D94"), lipgloss.Color("#EDFF82"), 50)
	dialogBoxStyle = lipgloss.NewStyle().
			Border(lipgloss.NormalBorder()).
			BorderForeground(lipgloss.Color("#E9D8A6")).
			Padding(1, 2).
			BorderTop(true).
			BorderLeft(true).
			BorderRight(true).
			BorderBottom(true)

	buttonStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FFF7DB")).
			Background(lipgloss.Color("#888B7E")).
			Padding(0, 3).
			MarginTop(1)

	activeButtonStyle = buttonStyle.
				Foreground(lipgloss.Color("#005F73")).
				Background(lipgloss.Color("#94D2BD")).
				Padding(0, 5).
				Underline(true)
	questionStyle = lipgloss.NewStyle().Width(50).Align(lipgloss.Center).Foreground(lipgloss.Color("#EE9B00"))
)

type selectedButton int

const (
	no selectedButton = iota
	yes
)

type DialogMsg struct {
	selectedChoice string
}

type Dialog struct {
	message  string
	selected selectedButton
	quitting bool
	loaded   bool
	cursor   int
	choice   string
	width    int
	height   int
	yesFunc  func() tea.Msg
	noFunc   func() tea.Msg
}

func (d Dialog) Init() tea.Cmd {
	return nil
}

func New(message string, width, height int, positiveAction, negativeAction func() tea.Msg) Dialog {
	return Dialog{
		message: message,
		width:   width,
		height:  height,
		yesFunc: positiveAction,
		noFunc:  negativeAction,
	}
}

func (d Dialog) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	case tea.WindowSizeMsg:
		d.width, d.height = msg.Width, msg.Height
		if !d.loaded {
			d.loaded = true
		}

	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			return d, tea.Quit

		case "left", "h":
			if d.selected != no {
				d.selected = no
			} else {
				d.selected = yes
			}
		case "right", "l":
			if d.selected != no {
				d.selected = no
			} else {
				d.selected = yes
			}
		case "enter":
			// Send the choice on the channel and exit.
			d.choice = choices[d.cursor]

			if d.selected == yes {
				return d, d.yesFunc
			} else {
				return d, d.noFunc
			}

		case "g":
			fmt.Println("how yall doin")
		}
	}
	return d, nil
}

func (d Dialog) View() string {
	if d.quitting {
		return ""
	}
	var okButton string
	var cancelButton string

	if d.selected == yes {
		okButton = activeButtonStyle.Render("Yes")
		cancelButton = buttonStyle.Render("No")
	} else {
		okButton = buttonStyle.Render("Yes")
		cancelButton = activeButtonStyle.Render("No")
	}

	question := questionStyle.Render(d.message)
	buttons := lipgloss.JoinHorizontal(lipgloss.Top, okButton, cancelButton)
	ui := lipgloss.JoinVertical(lipgloss.Center, question, buttons)

	dialog := lipgloss.Place(d.width, d.height,
		lipgloss.Center, lipgloss.Center,
		dialogBoxStyle.Render(ui),
		lipgloss.WithWhitespaceChars("/"),
		lipgloss.WithWhitespaceForeground(subtle),
	)

	return dialog
	// }
	// return "loading..."
}

func rainbow(base lipgloss.Style, s string, colors []color.Color) string {
	var str string
	for i, ss := range s {
		color, _ := colorful.MakeColor(colors[i%len(colors)])
		str = str + base.Foreground(lipgloss.Color(color.Hex())).Render(string(ss))
	}
	return str
}
