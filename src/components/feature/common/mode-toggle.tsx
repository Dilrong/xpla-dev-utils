import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const currentLabel =
    theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 rounded-full border border-transparent px-4 text-[0.62rem] uppercase tracking-[0.22em] text-foreground/[0.72] hover:border-border hover:bg-card hover:text-foreground"
        >
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[1.2rem] border border-border/70 bg-card/95 p-1"
      >
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggle
