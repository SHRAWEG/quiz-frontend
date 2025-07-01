// components/PreferencesModal.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetAllCategories } from '@/hooks/api/useCategory'
import { useSetUserPreference } from '@/hooks/api/useUserProfile'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function PreferencesModal({
  open,
  onClose,
  categoryIds
}: {
  open: boolean
  onClose: (selected?: string[]) => void
  categoryIds?: string[]
}) {
  const [selected, setSelected] = useState<string[]>([])
  const { data: categories } = useGetAllCategories();

  const query = useQueryClient();

  const { mutate: updatePreference, isPending } = useSetUserPreference();

  useEffect(() => {
    if (categoryIds) {
      setSelected(categoryIds);
    }
  }, [categoryIds])

  const handleSave = () => {
    updatePreference({ data: { categoryIds: selected } }, {
      onSuccess: () => {
        toast.success("Category preferences set successfully.")
        
        query.refetchQueries({
          queryKey: ['userPreference']
        })

        onClose(selected)
      },
      onError: (error) => {
        toast.error(error.data.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Your Learning Preferences</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose categories to personalize your learning experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selected.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelected(prev =>
                    checked
                      ? [...prev, category.id]
                      : prev.filter(id => id !== category.id)
                  )
                }}
              />
              <label htmlFor={category.id} className="text-sm font-medium">
                {category.name}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" disabled={isPending} onClick={() => onClose()}>
            {selected.length > 0 ? 'Cancel' : 'Skip'}
          </Button>
          <Button onClick={handleSave} disabled={selected.length === 0 || isPending}>
            {isPending ? <Loader2 className='animate-spin' /> : <Save />} Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}