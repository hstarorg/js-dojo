import { aceEditor } from './../../components';
import { staticData } from './../../services';
import { ajax, layer } from './../../common';

const createCodeObj = () => {
  return { editorTheme: 'github', mode: 'javascript', code: '', description: '' };
};

export default {
  components: {
    aceEditor
  },
  data() {
    return {
      languageModes: staticData.languageModes,
      editorThemes: staticData.editorThemes,
      gistName: '',
      gistDescription: '',
      codeFiles: [createCodeObj()]
    };
  },
  methods: {
    addFile() {
      this.codeFiles.push(createCodeObj());
      this.$nextTick(() => {
        let body = document.querySelector('body');
        body.scrollTop = body.scrollHeight;
      });
    },
    goMyGists() {
      this.$router.push('/mygists');
    },
    removeFile(idx) {
      this.codeFiles.splice(idx, 1);
    },
    saveGist() {
      if (!this.gistName) {
        return layer.error('Gist name required.');
      }
      let codeFiles = [];
      this.codeFiles.forEach(item => {
        if (item.code) {
          codeFiles.push(_.cloneDeep(item));
        }
      });
      if (codeFiles.length < 1) {
        return layer.error('Must have one file.');
      }
      ajax
        .post(`${AppConf.apiHost}/gist`, {
          gistName: this.gistName,
          gistDescription: this.gistDescription,
          codeFiles
        })
        .then(data => {
          this.$router.push('/mygists');
        });
    }
  }
};
