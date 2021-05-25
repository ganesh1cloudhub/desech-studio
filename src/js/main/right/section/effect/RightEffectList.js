import HelperDOM from '../../../../helper/HelperDOM.js'
import HelperEvent from '../../../../helper/HelperEvent.js'
import RightEffectForm from './RightEffectForm.js'
import RightEffectType from './RightEffectType.js'
import RightEffectCommon from './type/RightEffectCommon.js'
import RightCommon from '../../RightCommon.js'

export default {
  getEvents () {
    return {
      click: ['clickAddElementEvent', 'clickDeleteElementEvent', 'clickEditElementEvent'],
      dragdropbefore: ['dragdropbeforeElementEvent']
    }
  },

  handleEvent (event) {
    HelperEvent.handleEvents(this, event)
  },

  clickAddElementEvent (event) {
    if (event.target.closest('.add-effect-button')) {
      this.addElement(event.target.closest('.add-effect-button'))
    }
  },

  clickDeleteElementEvent (event) {
    if (event.target.closest('.delete-effect-button')) {
      this.deleteElement(event.target.closest('li'))
      event.preventDefault() // don't let the edit button trigger
    }
  },

  clickEditElementEvent (event) {
    if (event.target.closest('.effect-element')) {
      this.editElement(event.target.closest('li'))
    }
  },

  dragdropbeforeElementEvent (event) {
    if (event.target.classList.contains('effect-list')) {
      this.dragdropElement(event.detail)
    }
  },

  getDefaultType () {
    return 'filter'
  },

  getDefaultSubtype () {
    return 'drop-shadow'
  },

  addElement (button) {
    const section = button.closest('form')
    const list = section.getElementsByClassName(`effect-list-${this.getDefaultType()}`)[0]
    this.addElementLi(list, this.getDefaultType(), this.getDefaultSubtype())
    this.showEffectForm(section)
    RightEffectType.setEffect(section, this.getDefaultType(), this.getDefaultSubtype())
    RightCommon.toggleSidebarSection(section)
  },

  addElementLi (list, type, subtype) {
    const li = RightEffectType.insertElement(list, type, subtype)
    this.activateElement(li)
  },

  activateElement (li) {
    this.clearActiveElement(li)
    li.classList.add('active')
  },

  clearActiveElement (element) {
    for (const li of element.parentNode.parentNode.getElementsByClassName('active')) {
      li.classList.remove('active')
    }
  },

  showEffectForm (section) {
    this.hideEffectForm(section)
    this.addEffectForm(section)
  },

  hideEffectForm (section) {
    this.deselectAddButton(section.getElementsByClassName('add-effect-button')[0])
    const container = this.getFormContainer(section)
    this.clearContainer(container)
  },

  deselectAddButton (button) {
    button.classList.remove('selected')
  },

  getFormContainer (section) {
    return section.getElementsByClassName('effect-form-container')[0]
  },

  clearContainer (container) {
    HelperDOM.deleteChildren(container)
  },

  addEffectForm (section) {
    const form = HelperDOM.getTemplate('template-effect-form')
    const container = this.getFormContainer(section)
    this.addFormToContainer(form, container)
    const current = RightEffectCommon.getActiveElement(section)
    RightEffectForm.buildForm(form, current.dataset.type || this.getDefaultType(), current.dataset.subtype || this.getDefaultSubtype(), HelperDOM.getElementIndex(current))
  },

  addFormToContainer (form, container) {
    container.appendChild(form)
  },

  getActiveElementIndex (container) {
    const elem = RightEffectCommon.getActiveElement(container)
    return HelperDOM.getElementIndex(elem)
  },

  deleteElement (li) {
    const container = li.closest('.sidebar-section')
    this.deleteEffect(li)
    this.deleteListElement(li)
    RightCommon.toggleSidebarSection(container)
  },

  deleteEffect (li) {
    const index = HelperDOM.getElementIndex(li)
    RightEffectType.deleteEffect(li.dataset.type, li.dataset.subtype, index)
  },

  deleteListElement (li) {
    this.clearActiveElement(li)
    this.hideEffectForm(li.closest('#effect-section'))
    li.remove()
  },

  editElement (li) {
    if (!li.classList.contains('active')) {
      this.enableEditElement(li)
    } else {
      this.disableEditElement(li)
    }
  },

  enableEditElement (li) {
    this.activateElement(li)
    this.showEffectForm(li.closest('#effect-section'))
  },

  disableEditElement (li) {
    this.clearActiveElement(li)
    this.hideEffectForm(li.closest('#effect-section'))
  },

  dragdropElement (data) {
    const li = data.from.element
    RightEffectType.sortEffects(li.dataset.type, li.dataset.subtype, data.from.index, data.to.index)
  },

  injectList (section) {
    for (const type of ['filter', 'shadow', 'transform', 'transition', 'blend']) {
      RightEffectType.injectListType(section, type)
    }
  }
}
