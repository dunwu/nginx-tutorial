module.exports = {
  'code': 0,
  'messages': [
    '成功'
  ],
  'data': [
    {
      'key': 0,
      'title': 'Home',
      'icon': 'home',
      'type': 'Item',
      'url': '/pages/home',
      'children': []
    },
    {
      'key': 1,
      'title': 'Pages',
      'icon': 'user',
      'type': 'SubMenu',
      'url': null,
      'children': [
        {
          'key': 11,
          'title': 'Mailbox',
          'icon': 'mail',
          'type': 'Item',
          'url': '/pages/mailbox',
          'children': []
        },
        {
          'key': 12,
          'title': 'User',
          'icon': 'user',
          'type': 'Item',
          'url': '/pages/user',
          'children': []
        }
      ]
    },
    {
      'key': 2,
      'title': 'Others',
      'icon': 'coffee',
      'type': 'SubMenu',
      'url': null,
      'children': [
        {
          'key': 21,
          'title': 'Group1',
          'icon': 'windows-o',
          'type': 'ItemGroup',
          'url': null,
          'children': [
            {
              'key': 22,
              'title': 'Group1-1',
              'icon': null,
              'type': 'Item',
              'url': '/pages/home',
              'children': []
            }
          ]
        },
        {
          'key': 23,
          'title': 'Divider',
          'icon': null,
          'type': 'Divider',
          'url': null,
          'children': []
        },
        {
          'key': 24,
          'title': 'Group2',
          'icon': 'apple-o',
          'type': 'ItemGroup',
          'url': null,
          'children': [
            {
              'key': 25,
              'title': 'Group2-1',
              'icon': null,
              'type': 'Item',
              'url': '/pages/home',
              'children': []
            }
          ]
        }
      ]
    }
  ]
}
