use itertools::Itertools;
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

    #[wasm_bindgen(unchecked_return_type = "string[][]")]
    pub fn groups(&mut self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.sorted_groups()).unwrap()
    }
}

impl Ufdb {
    // HashMapの順序は毎回変わるので、表示が安定するように並べ替える
    // グループ内はキーの昇順、グループはサイズの降順（同じサイズなら中身の昇順）
    fn sorted_groups(&mut self) -> Vec<Vec<String>> {
        self.inner.groups()
            .into_values()
            .map(|group| group.into_iter().cloned().sorted().collect_vec())
            .sorted_by(|a, b| b.len().cmp(&a.len()).then_with(|| a.cmp(b)))
            .collect_vec()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_db_has_no_groups() {
        let mut ufdb = Ufdb::new();

        assert!(ufdb.sorted_groups().is_empty());
    }

    #[test]
    fn make_set_returns_false_for_existing_key() {
        let mut ufdb = Ufdb::new();

        assert!(ufdb.make_set("a"));
        assert!(!ufdb.make_set("a"));
    }

    #[test]
    fn merge_returns_false_when_already_in_same_group() {
        let mut ufdb = Ufdb::new();

        assert!(ufdb.merge("a", "b"));
        assert!(!ufdb.merge("b", "a"));
    }

    #[test]
    fn merge_creates_missing_keys() {
        let mut ufdb = Ufdb::new();

        ufdb.merge("a", "b");

        assert_eq!(ufdb.sorted_groups(), vec![vec!["a", "b"]]);
    }

    #[test]
    fn keys_in_group_are_sorted() {
        let mut ufdb = Ufdb::new();

        ufdb.merge("c", "a");
        ufdb.merge("a", "b");

        assert_eq!(ufdb.sorted_groups(), vec![vec!["a", "b", "c"]]);
    }

    #[test]
    fn groups_are_sorted_by_size_desc_then_by_keys() {
        let mut ufdb = Ufdb::new();

        for key in ["z", "c", "a", "d", "b", "y", "x", "e"] {
            ufdb.make_set(key);
        }
        ufdb.merge("d", "c");
        ufdb.merge("b", "a");
        ufdb.merge("x", "y");
        ufdb.merge("y", "z");

        assert_eq!(
            ufdb.sorted_groups(),
            vec![
                vec!["x", "y", "z"],
                vec!["a", "b"],
                vec!["c", "d"],
                vec!["e"],
            ],
        );
    }

    #[test]
    fn order_is_stable_across_calls() {
        let mut ufdb = Ufdb::new();

        for key in ["a", "b", "c", "d", "e", "f"] {
            ufdb.make_set(key);
        }

        let first = ufdb.sorted_groups();

        for _ in 0..10 {
            assert_eq!(ufdb.sorted_groups(), first);
        }
    }
}
