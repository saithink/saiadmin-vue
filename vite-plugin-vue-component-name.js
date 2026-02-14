export default function vueComponentNamePlugin() {
  return {
    name: 'vue-component-name',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.vue')) return null
      
      const viewsPath = 'src/views'
      const normalizedId = id.replace(/\\/g, '/')
      
      if (!normalizedId.includes(viewsPath)) return null
      
      const viewsIndex = normalizedId.indexOf(viewsPath)
      if (viewsIndex === -1) return null
      
      let componentName = normalizedId
        .substring(viewsIndex + viewsPath.length + 1)
        .replace(/\.vue$/, '')
        .split('/')
        .join('/')
      
      if (componentName.endsWith('/index')) {
        componentName = componentName.slice(0, -6)
      }
      
      if (code.includes('defineOptions') || /name\s*=\s*["']/.test(code)) {
        return null
      }
      
      const scriptSetupMatch = code.match(/<script\s+([^>]*)\bsetup\b([^>]*)>/i)
      if (scriptSetupMatch) {
        const fullMatch = scriptSetupMatch[0]
        if (/\bname\s*=/.test(fullMatch)) {
          return null
        }
        const newScript = `<script ${fullMatch.includes('lang="ts"') ? 'lang="ts" ' : ''}setup>
import { defineOptions } from 'vue';
defineOptions({ name: '${componentName}' });`
        return code.replace(fullMatch, newScript)
      }
      
      const templateEndMatch = code.match(/<\/template>/i)
      if (templateEndMatch) {
        const insertPoint = code.indexOf('</template>') + 11
        const before = code.substring(0, insertPoint)
        const after = code.substring(insertPoint)
        return `${before}\n<script setup>\nimport { defineOptions } from 'vue';\ndefineOptions({ name: '${componentName}' });\n</script>${after}`
      }
      
      return null
    }
  }
}
