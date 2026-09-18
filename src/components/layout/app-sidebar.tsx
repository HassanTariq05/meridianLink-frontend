import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
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

  const { theme } = useTheme()

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
            <img
              src={theme === 'dark' ? '/images/logo.png' : '/images/logo.png'}
              alt='Total Quality App Logo'
              style={{ height: '32px', width: 'auto' }}
            />
          </div>
        </SidebarHeader>
      )}

      {state === 'collapsed' && (
        <SidebarHeader>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={
                theme === 'dark'
                  ? '/images/logo_collapsed.png'
                  : '/images/logo_collapsed.png'
              }
              alt='Total Quality App Logo'
              style={{ height: '32px', width: 'auto' }}
            />
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
      {/* <SidebarFooter>
        <NavUser user={dynamicSidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
