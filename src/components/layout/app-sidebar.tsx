import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Logo } from '../Logo'
import { LogoCollapsed } from '../logo-collapsed'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { SidebarData } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  const user = useAuthStore()

  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'

  const isAdministrator = user?.auth?.user?.role?.name === 'Administrator'

  // const { data: accreditations } = useAccreditations(isSuperAdmin, orgId)
  // const {data : accreditations} = [useAccreditations(isSuperAdmin, orgId)]

  const { state } = useSidebar()
  // const accreditationItems: {
  //   title: string
  //   url: string
  //   icon?: LucideIcon
  // }[] =
  //   accreditations?.map((acc) => ({
  //     title: acc.name,
  //     url: `/accreditation/${acc.id}`,
  //   })) || []

  // canAddAccreditation && isSuperAdmin
  //   ? accreditationItems.push({
  //       title: 'Add Accreditation',
  //       url: '/accreditation/create',
  //       icon: BadgePlus,
  //     })
  //   : []
  // const othersNavGroup = {
  //   title: 'Others',
  //   items: [administrationItem],
  // }

  const dynamicSidebarData: SidebarData = {
    ...sidebarData,
    navGroups: [
      ...sidebarData.navGroups.map((group) => {
        if (group.title !== 'Agents') return group

        return {
          ...group,
          items: group.items.map((item) => {
            return item
          }),
        }
      }),
      ...(isSuperAdmin || isAdministrator ? [] : []),
    ] as any,
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {state === 'expanded' && (
        <SidebarHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Logo />
          </div>
        </SidebarHeader>
      )}

      {state === 'collapsed' && (
        <SidebarHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <LogoCollapsed />
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        {dynamicSidebarData.navGroups.map((props) => (
          <NavGroup
            key={props.title}
            {...props}
            defaultOpen={props.title === 'General' || props.title === 'Others'}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
