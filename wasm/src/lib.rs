use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Ufdb {
    inner: ufodb_v0::Ufdb,
}

#[wasm_bindgen]
impl Ufdb {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: ufodb_v0::Ufdb::new()
        }
    }

    pub fn make_set(&mut self, key: &str) -> bool {
        self.inner.make_set(key)
    }

    pub fn merge(&mut self, key_a: &str, key_b: &str) -> bool {
        self.inner.unite(key_a, key_b)
    }
}
